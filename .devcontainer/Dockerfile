FROM node:latest
USER node
WORKDIR /home/node
ENV PATH $PATH:/home/node/.cargo/bin
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s - -y \
  && cargo install wasm-pack
CMD [ "/bin/bash" ]
