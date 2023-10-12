import { Tree_node } from "./tree";
import { countOccurrence, toKeyMapWithValue } from "./utils";

class HuffmanEncoder {
    encoded_text: string;
    unencoded_text: string;
    
    constructor() {
        this.encoded_text = ""
        this.unencoded_text = ""
    }

    digest(txt: string) {
        this.unencoded_text += txt
    }

    encode() {
        var nodes = Array.from(countOccurrence(this.unencoded_text).entries())
        .map(([char, prob]: [string, number]) => new Tree_node(prob, char));

        const leaf_nodes = [...nodes];

        while (nodes.length > 1) {
            nodes = this.extend_tree(nodes)
        }
        nodes[0].assign_binaries()
        const char_to_bin = toKeyMapWithValue<Tree_node, string, ("0"|"1")[]>(leaf_nodes, "character", "binaries")

        var out: ("0"|"1")[][] = []

        for (let char of this.unencoded_text) {
            const bin = char_to_bin.get(char);
            if (!bin) {
                throw Error("missing a character " + char)
            }
            out.push(bin);

        }
        return out.flat().join("")
    }

    private extend_tree(nodes: Tree_node[]) {
        nodes = nodes.sort((a: Tree_node, b: Tree_node) => a.p - b.p)
        return [
            new Tree_node(
                nodes[0].p + nodes[1].p,
                undefined,
                [nodes[0], nodes[1]]
            ),
            ...nodes.splice(2)
        ]
    }
}

const txt_url = "https://raw.githubusercontent.com/partoftheorigin/text-generation-datasets/master/william_shakespeare/A%20Midsummer%20Night%E2%80%99s%20Dream.txt"
var request = require('request');
const txt = new Promise<string>((resolve, reject) => {
    request.get(txt_url, function (error: any, response: any, body: string) {
        if (!error && response.statusCode == 200) {
            resolve(body)
        }
        else {
            reject()
        }
    })
})

const enc = new HuffmanEncoder()
txt
.then((txt) => enc.digest(txt))
.then(()=> enc.encode())
.then(async (encoded) => {
    const source = (await txt);
    console.log("unencoded size: ", source.length)
    console.log("encoded size:   ", encoded.length/8)
    console.log("bits per char:  ", encoded.length/source.length)
})