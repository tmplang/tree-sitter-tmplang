## Create image
`docker build -t tree-sitter-tmplang:v1 -f Dockerfile .`

## Run container
`docker run -it --rm -v $PWD/src/:/root/source/tree-sitter-tmplang tree-sitter-tmplang:v1`

## Generate parser
`tree-sitter generate`

## Parse a test file
`tree-sitter parse test/example.tmp`

## Run highlighting
`tree-sitter highlight test/example.tmp`
