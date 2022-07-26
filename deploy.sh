#!/bin/sh


cp .env _env;
git add . ;
git commit -m 'deploy';
git push;
