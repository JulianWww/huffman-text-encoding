const printTree = require("print-tree");

interface PrintableNode {
    name: string,
    children?: PrintableNode[]
}

export class Tree_node {
    /**
     * the occurance probability
     */
    p: number;

    children?: [Tree_node, Tree_node];
    binaries: ("0"|"1")[];
    character?: string;


    constructor(p: number, chars: undefined|string=undefined, children: undefined|[Tree_node, Tree_node]=undefined) {
        this.p = p;
        this.character = chars;
        this.binaries = []
        this.children = children;
    }

    assign_binaries(upper:("0"|"1")[] = []) {
        this.binaries = upper;
        if (this.children) {
            this.children[0].assign_binaries([...upper, "0"]);
            this.children[1].assign_binaries([...upper, "1"])
        }
    }

    print() {
        printTree(
            this.build_printable_tree(),
            (node: any) => node.name,
            (node: any) => node.children,
        )
    }

    private build_printable_tree(): PrintableNode {
        if (this.character) {
            return {
                "name": JSON.stringify(this.character) + "\t\t" + this.binaries.join("")
            }
        }
        if (this.children) {
            return {
                "name": "",
                "children": this.children.map((child: Tree_node) => child.build_printable_tree())
            }
        }
        return {"name": "ERROR END; dead end without leaf node"}
    }
}