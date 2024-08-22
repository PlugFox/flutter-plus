import { wrapWith } from "../utils";

const snippetSizedBox = (widget: string) => {
  return `SizedBox(
  width: \${1:double.infinity},
  height: \${2:double.infinity},
  child: ${widget},
)`;
};

export const wrapWithSizedBox = async () =>
  wrapWith(snippetSizedBox);

const snippetListenableBuilder = (widget: string) => {
  return `ListenableBuilder(
  listenable: \${1:listenable},
  builder: (context, _) =>
    ${widget},
)`;
};

export const wrapWithListenableBuilder = async () => wrapWith(snippetListenableBuilder);

const snippetValueListenableBuilder = (widget: string) => {
  return `ValueListenableBuilder<\${1:Value}>(
  valueListenable: \${2:valueListenable},
  builder: (context, value, _)
    ${widget},
)`;
};


export const wrapWithValueListenableBuilder = async () => wrapWith(snippetValueListenableBuilder);

const snippetRepaintBoundary = (widget: string) => {
  return `RepaintBoundary(
  child: ${widget},
)`;
};

export const wrapWithRepaintBoundary = async () => wrapWith(snippetRepaintBoundary);