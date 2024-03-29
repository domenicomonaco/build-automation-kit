# Build Automation KIT

<img  style="margin:5px" src="docs/build-automation-kit-cover.png" />

### Requirements

* node (16.15.1 as default) <https://nodejs.org/it/> 
* npm <https://www.npmjs.com/>
* nvm <https://github.com/nvm-sh/nvm>
* git <https://git-scm.com/>

### Advanced Usage

Clone the source files of the theme and navigate into the theme's root directory. Run `npm install`. You can view the `package.json` file to see which scripts are included.

#### List of Users
List of users need to be stored into *users.csv* and need contain id, nome, cognome and gitusername columns at least

#### Configuration
Configuration is stored into *.env* file

#### Pay Attention

**This software is an automation kit, therefore has some automation also critical such as "hard reset", "deleting folders" and "discarding changes".** 

 **Therefore, PAY ATTENTION** while using it, is possible that some bugs can overwrite your work! As happen using git features.

I suggesting using it into **"controlled space"** to prevent disaster in others folder.

#### Usage
          
            //////
    ___oOOo( ͡° ͜ ͡° )oOOo____[BAK IS BACK: BUILD AUTOMATION KIT] __________[GNU GPL v3]

    bak <command>

    Comandi:
      bak loop    Looping on all users to update or reinitialize repos (must be
                  selected at least one mode)
      bak select  Select a single user from the csv file

    Opzioni:
          --version  Mostra il numero di versione                         [booleano]
      -f, --file     CVS file with list of git users
                                    [stringa] [richiesto] [predefinito: "users.csv"]
      -r, --repo     Name of single repo, default was taken from .env
                    [stringa] [richiesto] [predefinito: "js-array-objects-carousel"]
      -h, --help     Mostra la schermata di aiuto                         [booleano]

    for more information, find the documentation at https://tecnologieperpersone.it

## Authors and License
Copyright © 2022 [Tecnologie per Persone di Domenico Monaco](https://www.tecnologieperpersone.it) 

Released under [GPL v3 License LICENSE.md](LICENSE)

### Developed by 
[<img align="left" style="margin:5px" src="http://cdn.tecnologieperpersone.it/img/dmonaco_happy_hacking.png" height="32" />](https://blog.domenicomonaco.it)

[<img style="margin:5px" src="http://cdn.tecnologieperpersone.it/img/tecnologie-per-persone-logo.png" height="32" />](https://tecnologieperpersone.it)

#### Developed for collaboration "Class 65 - Boolean SRL"

[<img style="margin:5px" src="docs/boolean-logo.png" height="32" />](https://boolean.careers/)
