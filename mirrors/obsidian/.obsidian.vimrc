" Yank to system clipboard
set clipboard=unnamed

unmap <Space>

exmap vertsplit obcommand workspace:split-vertical
nmap <Space>v :vertsplit

exmap togglefold obcommand editor:toggle-fold
nmap zo :togglefold
nmap zc :togglefold
nmap za :togglefold

exmap unfoldall obcommand editor:unfold-all
nmap zR :unfoldall

exmap foldall obcommand editor:fold-all
nmap zM :foldall

nmap <Space> <leader>

exmap fuzzyfinder obcommand switcher:open
nmap <leader>f :fuzzyfinder

exmap filetree obcommand file-explorer:reveal-active-file
nmap <leader>t :filetree

nmap <leader>/ :noh

nmap J <C-d>zz
nmap K <C-u>zz

exmap h0 obcommand editor:set-heading-0
exmap h1 obcommand editor:set-heading-1
exmap h2 obcommand editor:set-heading-2
exmap h3 obcommand editor:set-heading-3
exmap h4 obcommand editor:set-heading-4
exmap h5 obcommand editor:set-heading-5
exmap h6 obcommand editor:set-heading-6
nmap <leader>0 :h0 
nmap <leader>1 :h1 
nmap <leader>2 :h2 
nmap <leader>3 :h3 
nmap <leader>4 :h4 
nmap <leader>5 :h5 
nmap <leader>6 :h6 

" Go back and forward with Ctrl+O and Ctrl+I
" (make sure to remove default Obsidian shortcuts for these to work)
exmap back obcommand app:go-back
nmap H :back
exmap forward obcommand app:go-forward
nmap L :forward
