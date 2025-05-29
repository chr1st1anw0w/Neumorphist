export PATH="/opt/homebrew/bin:$PATH"

# 基本 PATH 設定
export PATH="$HOME/.bun/bin:$PATH"

# bun completions
[ -s "/Users/christianwu/.bun/_bun" ] && source "/Users/christianwu/.bun/_bun"
# The following lines have been added by Docker Desktop to enable Docker CLI completions.
fpath=(/Users/christianwu/.docker/completions $fpath)
autoload -Uz compinit
compinit
# End of Docker CLI completions
