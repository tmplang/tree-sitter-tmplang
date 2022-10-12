FROM ubuntu:20.04

LABEL version="0.1"
LABEL description="Docker Image for developing Tree-sitter syntax highlighting \
                   for tmplang."

# Install required deps: C/C++ compiler and Node.js => 6.0
RUN apt update
RUN apt install -y gcc g++ nodejs

# Install latest available tree-sitter-cli binary
RUN apt install -y cargo
RUN cargo install tree-sitter-cli
# Append cargo bin directory to PATH
ENV PATH="$PATH:/root/.cargo/bin"

# Init config file
RUN tree-sitter init-config

# Set working dir
WORKDIR /root/source/tree-sitter-tmplang
