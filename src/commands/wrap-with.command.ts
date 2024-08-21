import { wrapWith } from "../utils";

const snippetListenableBuilder = (widget: string) => {
  return `ListenableBuilder(
  listenable: \${1:listenable},
  builder: (context, _) =>
    ${widget},
)`;
};

const snippetValueListenableBuilder = (widget: string) => {
  return `ValueListenableBuilder<\${1:Value}>(
  valueListenable: \${2:valueListenable},
  builder: (context, value, _)
    ${widget},
)`;
};

export const wrapWithListenableBuilder = async () => wrapWith(snippetListenableBuilder);

export const wrapWithValueListenableBuilder = async () => wrapWith(snippetValueListenableBuilder);