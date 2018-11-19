# localizediff

_localizediff est un logiciel qui permet de synchroniser des fichiers de traduction au format json avec le logiciel SaaS de traduction [localise.biz/](https://localise.biz/) codé en [NodeJs](https://nodejs.org/en/)_

Démo youtube:

[![Démo](https://img.youtube.com/vi/howNUTq09Oo/0.jpg)](https://www.youtube.com/watch?v=howNUTq09Oo)

## Pré-requis

_NodeJs sur le serveur en version minimum 8_

## Installation

```bash
npm -g install localizediff
```

## Logiciel

> Utiliser l'option `-v` afin d'afficher un maximum d'informations

```bash
$ localizediff -h

  Usage: localizediff [options] <cmd>

  Options:

    -V, --version                output the version number
    -v, --verbose                display verbose
    -f, --from [language]        language from extract
    -d, --direction [direction]  use 'down' if local changes should be overwritten [default: 'down'] ( use for sync cmd )
    -h, --help                   output usage information

  Infos:
	Write configuration in localize.yaml file. Open README.md

  Commandes:
	sync 	 synchronize translation with localise.biz
	extract  extract key from language for others
	download downlaod translations file from localise.biz to local pathToTranslations

  Usages:
	localizediff sync
	localizediff -v -d up sync
	localizediff -l en extract
	localizediff -v -f fr extract
	localizediff -v download
```

### Configuration

_La configuration du fichier se fait via un fichier nommé `localize.yaml` (voir le fichier localize.yaml.dist) à la racine du projet_

```yaml
params:
  localisebiz: https://localise.biz/api # link to api localise.biz
  languages: ["en", "fr"] # language do you want translate
  pathToTranslations: # path to local folder with all translation files (fr.json, en.json, es.json, ...)
  key: # key read and write localise.biz api
  filter: reactjs # tag
  commandAfterSync: # command execute if files changed after synchronization (ex : "make --directory=/home/my-project yarn-install")
```

> Les fichiers de traduction doivent avoir comme nom le partern suivant : {code ISO 639-1}.json (fr.json, en.json, zh.json, ...) [Wikipedia](https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1)

# Localise.biz

## Initialiser mon projet

1.  Il faut choisir les langues dont le projet sera traduit.

> Choisir les extensions de langue plutot que les pays par exemple pour l'anglais choisir `en`

Aller sur le projet https://localise.biz/ et dans l'onglet "Manage" cliquer sur le "+" à coté de la langue principal . Faire une
recherche avec le mot clé "en" et sélectionner [EN] English

2.  Générer une clé API read/write

Aller sur le projet https://localise.biz/ et dans le menu de droite cliquer sur la clé à molette et cliquer sur "API Keys" .
En suite générer une key API dite "read and write".

# Cas utilisations

**1. Initialiser un projet**

- _J'ai_

  J'ai un projet existant avec un fichier de traduction dans une langue (exemple Français)

- _Je veux_

  Je veux que le projet sois traduisible en plusieurs langages (exemple Français / Anglais) sur localise.biz

_Étape n°1 : Mon fichier de configuration_

localize.yaml

```yaml
params:
  localisebiz: https://localise.biz/api
  languages: ["fr", "en"]
  pathToTranslations: /path/to/translations
  key: pn1sRbXIzpnDokQ7NxukHSXCAsRgY99Gw
  filter: reactjs
```

_Étape n°2 : Extraction du fichier de traduction français pour la traduction anglaise_

```bash
$ localizediff -v -l fr extract
```

_Étape n°3: Synchroniser les traductions du projet en local vers localise.biz_

```bash
$ localizediff -v -d up sync
```

**2. Le projet est sur un serveur recette, ux ou prod**

- _J'ai_

  Le projet est installé sur un serveur de prod

- _Je veux_

  Je veux que la traduction se met automatiquement à jours si un product owner change du texte

_Étape n°1 : Mon fichier de configuration_

localize.yaml

```yaml
params:
  localisebiz: https://localise.biz/api
  languages: ["fr", "en"]
  pathToTranslations: /path/to/translations
  key: pn1sRbXIzpnDokQ7NxukHSXCAsRgY99Gw
  filter: reactjs
  commandAfterSync: "make --directory=/path/to/Makefile yarn-build" # example make execute `yarn build`
```

_Étape n°2 : Création d'un cron toutes les 30 minutes_

`*/30 * * * * localizediff sync >/dev/null 2>&1`

**3. Mettre à jours localise.biz**

- _J'ai_

  J'ai fait une modification en local

- _Je veux_

  Je veux mettre à jours ma version sur localise.biz

_Étape n°1 : Synchroniser les traductions du local vers localise.biz_

```bash
$ localizediff -v -d up sync
```

**4. Mettre à jours mon environement de développement**

- _J'ai_

  Le Product Owner a mis à jours la traduction sur localise.biz

- _Je veux_

  Je veux mettre à jours mon environnement de développement

_Étape n°1 : Synchroniser les traductions de localise.biz vers mon locale_

```bash
$ localizediff -v sync
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
$ localizediff -v download
```

**6. React-intl**

- _J'ai_

  un projet qui utilise [react-intl](https://github.com/yahoo/react-intl)

- _Je veux_

  Extraire les clefs qui sont defini dans mon code par [defineMessages](https://github.com/yahoo/react-intl/wiki/API#definemessages) ou le composant [FormattedMessage](https://github.com/yahoo/react-intl/wiki/Components#formattedmessage) et uploader sur localise et les charger sur localise.biz

_Étape n°1:_

Edit le fichier yaml pour renseigner messagesFileName (par default: _messages_), pathToReactMessages:

```yaml
params:
  localisebiz: https://localise.biz/api
  languages:
  pathToTranslations: /path/to/translations
  pathToReactMessages: path/to/extracted/messages
  messagesFileName: messages
  key:
  filter:
  commandAfterSync:
```

_Étape n°2:_

```bash
$ extractmessages --help

Usage: react-intl-cra <pattern> [options]

<pattern> Glob pattern to specify files.
          Needs to be surrounded with quotes to prevent shell globbing.
          Guide to globs: https://github.com/isaacs/node-glob

Options:
  -o, --out-file  Output into a single file                             [string]
  -h, --help      Show help                                            [boolean]
  -v, --version   Show version number                                  [boolean]

Examples:
  react-intl-cra 'src/App.js'                   One file.
  react-intl-cra 'src/**/*.js'                  Pattern to specify files
  react-intl-cra 'src/**/*.js' -o message.json  Output into a single file.


For more information go to https://github.com/evenchange4/react-intl-cra
```

_Étape n°3:_

Syncro avec localise.biz (mets a jour seulement le francais):

```bash
  $ localizediff import
```
