# You can find the new timestamped tags here: https://hub.docker.com/r/gitpod/workspace-base/tags
FROM gitpod/workspace-base:latest

# Change your version here
ENV GO_VERSION=1.21.7

# For ref, see: https://github.com/gitpod-io/workspace-images/blob/61df77aad71689504112e1087bb7e26d45a43d10/chunks/lang-go/Dockerfile#L10
ENV GOPATH=$HOME/go-packages
ENV GOROOT=$HOME/go
ENV PATH=$GOROOT/bin:$GOPATH/bin:$PATH
RUN curl -fsSL https://dl.google.com/go/go${GO_VERSION}.linux-amd64.tar.gz | tar xzs \
    && printf '%s\n' 'export GOPATH=/workspace/go' \
                      'export PATH=$GOPATH/bin:$PATH' > $HOME/.bashrc.d/300-go

RUN curl -fsSL https://deb.nodesource.com/setup_18.x  | sudo bash - \
    && sudo apt-get install -y nodejs && sudo npm install -g yarn
