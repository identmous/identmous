import adapter from "@sveltejs/adapter-cloudflare";
import preprocess from "svelte-preprocess";
import { parse, walk } from "svelte/compiler";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [preprocess(), ioniconsImportOptimizer()],

  kit: {
    adapter: adapter(),
    csrf: { checkOrigin: false }
  }
};

export default config;

function ioniconsImportOptimizer() {
  return {
    script({ content, filename }) {
      if (!filename) return { code: content };
      const code = walkAndReplace(
        { type: "script", content, filename },
        ({ node }, replaceContent) => {
          if (node.type === "ImportDeclaration") {
            if (node.source.value === "svelte-ionicons") {
              replaceContent(
                node,
                node.specifiers
                  .map(({ local }) => {
                    return `import ${local.name} from "svelte-ionicons/${local.name}.svelte"`;
                  })
                  .join("\n")
              );
            }
          }
        }
      );
      return { code };
    }
  };
}

// from https://github.com/carbon-design-system/carbon-preprocess-svelte/blob/3e942b4ff24c7bba74717374c2b2b71b75712528/src/walk-and-replace.ts
// license https://github.com/carbon-design-system/carbon-preprocess-svelte/blob/3e942b4ff24c7bba74717374c2b2b71b75712528/LICENSE
const OFFSET = {
  script: "<script>",
  style: "<style>",
  markup: ""
};

const clampContent = (type, content) => {
  switch (type) {
    case "script":
      return `<script>${content}</script>`;
    case "style":
      return `<style>${content}</style>`;
    default:
      return content;
  }
};

const getAst = (type, ast) => {
  switch (type) {
    case "script":
      return ast.instance;
    case "style":
      return ast.css;
    case "markup":
      return ast.html;
    default:
      return undefined;
  }
};

function walkAndReplace(options, replaceWith, getContent) {
  let content = options.content;

  const ast = parse(clampContent(options.type, content), {
    filename: options.filename
  });

  let cursor = -1 * OFFSET[options.type].length;

  function replaceContent(node, replaceWith, replacee) {
    let replaced = replacee ?? content.slice(node.start + cursor, node.end + cursor);
    content = content.replace(replaced, replaceWith);
    cursor += replaceWith.length - replaced.length;
  }

  function getContent(node) {
    return content.slice(node.start + cursor, node.end + cursor);
  }

  walk(getAst(options.type, ast), {
    enter(node, parentNode) {
      replaceWith.apply(this, [{ node, parentNode }, replaceContent, getContent]);
    }
  });

  return content;
}
