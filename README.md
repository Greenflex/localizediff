# LocaliseBizSync

_LocaliseBizSync est un logiciel qui permet de synchroniser des fichiers de traduction au format json avec le logiciel SaaS de traduction [localise.biz/](https://localise.biz/) codé en [NodeJs](https://nodejs.org/en/)_

> [Comment traduire sur Symfony](./SYMFONY.md)

## Pré-requis

_NodeJs sur le serveur en version minimum 8_

## Installation

- Npm

```bash
npm install
```

- Yarn

```bash
yarn install
```

## Logiciel

> Utiliser l'option `-v` afin d'afficher un maximum d'informations

```bash
$ node localisebizsync.js -h

  Usage: localisebizsync [options] <cmd>

  Options:

    -V, --version                output the version number
    -v, --verbose                display verbose
    -l, --language [language]    language from extract
    -d, --direction [direction]  use 'down' if local changes should be overwritten [default: 'down'] ( use for sync cmd )
    -h, --help                   output usage information

  Infos:
	Write configuration in config.yaml file. Open README.md

  Commandes:
	sync 	 synchronize translation with localise.biz
	extract  extract key from language for others
	download downlaod translations file from localise.biz to local pathToTranslations

  Usages:
	node localisebizsync.js sync
	node localisebizsync.js -v -d up sync
	node localisebizsync.js -l en extract
	node localisebizsync.js -v -l fr extract
	node localisebizsync.js -v download
```

### Configuration

_La configuration du fichier se fait via un fichier nommé `config.yaml` (voir le fichier config.yaml.dist)_

```yaml
params:
  localisebiz: https://localise.biz/api # link to api localise.biz
  languages: ["en", "fr"] # language do you want translate
  pathToTranslations: # path to local folder with all translation files (fr.json, en.json, es.json, ...)
  key: # key read and write localise.biz api
  filter: reactjs # tag for separate symfony files translation and reactjs files translation
  commandAfterSync: # command execute if files changed after synchronization (ex : "make --directory=/home/my-project yarn-install")
```

> Les fichiers de traduction doivent avoir comme nom le partern suivant : {code ISO 639-1}.json (fr.json, en.json, zh.json, ...) [Wikipedia](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1)

# Localise.biz

## Initialiser mon projet

1. Il faut choisir les langues dont le projet sera traduit.

> Choisir les extensions de langue plutot que les pays par exemple pour l'anglais choisir `en`

![img1](./documentation/images/img1.png)
![img2](./documentation/images/img2.png)

2. Générer une clé API read/write

![img3](./documentation/images/img3.png)
![img4](./documentation/images/img4.png)

# Cas utilisations

**1. Initialiser un projet**

- _J'ai_

  J'ai un projet existant avec un fichier de traduction dans une langue (exemple Français)

- _Je veux_

  Je veux que le projet sois traduisible en plusieurs langages (exemple Français / Anglais) sur localise.biz

_Étape n°1 : Mon fichier de configuration_

config.yaml

```yaml
params:
  localisebiz: https://localise.biz/api
  languages: ["fr", "en"]
  pathToTranslations: /path/to/translations
  key: pn1pnDoAsRgY99sRkQ7NxukHSXCbXIzGw
  filter: reactjs
```

_Étape n°2 : Extraction du fichier de traduction français pour la traduction anglaise_

```bash
$ node localisebizsync.js -v -l fr extract
```

_Étape n°3: Synchroniser les traductions du projet en local vers localise.biz_

```bash
$ node localisebizsync.js -v -d up sync
```

**2. Le projet est sur un serveur recette, ux ou prod**

- _J'ai_

  Le projet est installé sur un serveur de prod

- _Je veux_

  Je veux que la traduction se met automatiquement à jours si un product owner change du texte

_Étape n°1 : Mon fichier de configuration_

config.yaml

```yaml
params:
  localisebiz: https://localise.biz/api
  languages: ["fr", "en"]
  pathToTranslations: /path/to/translations
  key: pn1pnDoAsRgY99sRkQ7NxukHSXCbXIzGw
  filter: reactjs
  commandAfterSync: "make --directory=/path/to/Makefile assets" # make assets execute `yarn build`
```

_Étape n°2 : Création d'un cron toutes les 15 minutes_

`*/30 * * * * node /path/to/LocaliseBizSync/localisebizsync.js sync >/dev/null 2>&1`

**3. Mettre à jours localise.biz**

- _J'ai_

  J'ai fait une modification en local

- _Je veux_

  Je veux mettre à jours ma version sur localise.biz

_Étape n°1 : Synchroniser les traductions du local vers localise.biz_

```bash
$ node localisebizsync.js -v -d up sync
```

**4. Mettre à jours mon environement de développement**

- _J'ai_

  Le Product Owner a mis à jours la traduction sur localise.biz

- _Je veux_

  Je veux mettre à jours mon environnement de développement

_Étape n°1 : Synchroniser les traductions de localise.biz vers mon locale_

```bash
$ node localisebizsync.js -v sync
```

**5. Je ne veux pas que mes fichiers de traduction soient sur mon logiciel de gestion de versions Git**

- _J'ai_

  Mes traductions sont sur localise.biz et seulement sur localise.biz

- _Je veux_

  Je veux pouvoir coder avec mes fichiers de traduction en local dans un projet react

_Étape n°1 : Ignorer les fichiers de traduction sur git_

Editer le fichier _.gitignore_

```
/path/to/folder/translation
```

_Étape n°2 : Télécharger les traductions de localise.biz vers mon locale_

```bash
$ node localisebizsync.js -v download
```
