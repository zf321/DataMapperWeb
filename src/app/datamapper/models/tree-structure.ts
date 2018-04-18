import { TreeContainer } from './tree-container';
import { ViewNode } from "./node";

export class TreeStructure {

  // parentContainer: TreeContainer = null;
  data = null;
  rootTitle: string = "title";
  level = 0;
  rank = 0;
  resultPane;
  parentNode: ViewNode;
  children = {};
  rootNode: ViewNode;
  nodeCollection: ViewNode[] = [];
  nodeHeight: number;
  rankMargin: number;
  containerId: string;
  containerWidth: number;
  containerType: string;


  constructor(
    // parentContainer,
    nodeCollection: ViewNode[],
    nodeHeight: number,
    rankMargin: number,
    containerId: string,
    containerWidth: number,
    containerType: string,
    data,
    rootTitle: string,
    level: number,
    rank: number,
    resultPane,
    parentNode: ViewNode) {
    // this.parentContainer = parentContainer;
    this.data = data;
    this.rootTitle = rootTitle;
    this.level = level;
    this.rank = rank;
    this.resultPane = resultPane;
    this.parentNode = parentNode;
    this.nodeCollection = nodeCollection;
    this.nodeHeight = nodeHeight;
    this.rankMargin = rankMargin;
    this.containerId = containerId;
    this.containerWidth = containerWidth;
    this.containerType = containerType;
  }

  public initTree(root, isAttribute) {

    var rootName = this.rootTitle,
      resultPane = this.resultPane,
      parentNode = this.parentNode,
      level = this.level,
      rank = this.rank,
      x = 0,
      y = level * this.nodeHeight,
      overhead = rank * this.rankMargin,
      tempParent = null,
      node = parentNode;


    if (root.type === "object") {
      if (rootName !== "") {
        node = this.initTreeNode(resultPane, parentNode ? parentNode.id : null, rootName, root.type, "object", false, x, y, rank);
        this.rootNode = node;
        rank++;
        level++;

      }

    } else if (root.type === "array") {
      //            console.log(root);
      var keys = root.items || {}; //select ITEMS
      if (rootName !== "") {
        var nodeText = rootName;
        node = this.initTreeNode(resultPane, parentNode ? parentNode.id : null, nodeText, keys.type, "array", !keys.hasOwnProperty("properties"), x, y, rank);
        this.rootNode = node;
        rank++;
        level++;
      }

    } else { //if (DataMapper.Types.indexOf(root.type) > -1) {    //when the type is a primitive
      if (rootName !== "") {
        var nodeText = rootName,
          category = isAttribute ? "attribute" : "leaf";
        node = this.initTreeNode(resultPane, parentNode ? parentNode.id : null, nodeText, root.type, category, true, x, y, rank);
        this.rootNode = node;
        rank++;
        level++;
      }
    }
    if (rootName === "") {
      node = parentNode;
    }
    tempParent = node.supportGroup;
    if (root.attributes) {
      var keys = root.attributes;
      for (var i = 0; i < Object.keys(keys).length; i++) { //traverse through each PROPERTY of the object
        var keyName = Object.keys(keys)[i];
        var key = keys[keyName];
        var tree = new TreeStructure(
          this.nodeCollection,
          this.nodeHeight,
          this.rankMargin,
          this.containerId,
          this.containerWidth,
          this.containerType,
          key,
          keyName,
          level,
          rank,
          tempParent,
          node,
        );
        level = tree.initTree(key, true);
        this.children[keyName] = tree;
      }
    }
    if (root.properties) {
      var keys = root.properties; //select PROPERTIES
      for (var i = 0; i < Object.keys(keys).length; i++) { //traverse through each PROPERTY of the object
        var keyName = Object.keys(keys)[i];
        var key = keys[keyName];
        var tree = new TreeStructure(
          this.nodeCollection,
          this.nodeHeight,
          this.rankMargin, this.containerId,
          this.containerWidth,
          this.containerType,
          key,
          keyName,
          level,
          rank,
          tempParent,
          node,
        );
        level = tree.initTree(key, false);
        this.children[keyName] = tree;
      }
    }
    if (root.items && root.items.properties) {
      var keys = root.items.properties; //select PROPERTIES
      for (var i = 0; i < Object.keys(keys).length; i++) { //traverse through each PROPERTY of the object
        var keyName = Object.keys(keys)[i];
        var key = keys[keyName];
        var tree = new TreeStructure(
          this.nodeCollection,
          this.nodeHeight,
          this.rankMargin, this.containerId,
          this.containerWidth,
          this.containerType,
          key,
          keyName,
          level,
          rank,
          tempParent,
          node,
        );
        level = tree.initTree(key, false);
        this.children[keyName] = tree;
      }
    }
    return level;

  }
  public initTreeNode = (parent, parentNodeId: string, text: string, textType: string, category: string, isLeaf: boolean, x: number, y: number, rank: number) => {
    var node = new ViewNode(
      parent,
      parentNodeId,
      this.containerId,
      text,
      textType,
      x,
      y,
      this.containerType,
      category,
      isLeaf,
      this.nodeHeight,
      this.containerWidth,
      rank
    );
    // var group = parent.append("g").attr("class", "nested-group");
    // node.supportGroup = group;
    this.nodeCollection.push(node);
    // node.tree = this;
    return node;
  }

  addNodeToTree = (parent, parentNode, text, textType, category, isLeaf, x, y, overhead, data, level, rank) => {
    var newNode = this.initTreeNode(parent, parentNode, text, textType, category, isLeaf, x, y, rank);
    var tree = new TreeStructure(
      this.nodeCollection,
      this.nodeHeight,
      this.rankMargin, this.containerId,
      this.containerWidth,
      this.containerType,
      data,
      text,
      level,
      rank,
      parent,
      parentNode,
    );

    // newNode.tree = tree;
    this.children[text] = tree;

    return newNode;
  }

  removeNodeFromTree = (node) => { //remove node from parent tree
    var key = node.text;
    var childTree = this.children[key];
    delete this.children[key];
    console.log(this.children);
    return childTree;
  }

  deleteTree = function (count) {
    if (Object.keys(this.children).length === 0) {
      //if no children
      count++;
      this.rootNode.deleteNode();
      return count;
    } else {
      for (var key in this.children) {
        var obj = this.children[key];
        count = obj.deleteTree(count);
        delete this.children[key];
      }
      return this.deleteTree(count);
    }
  }
}
