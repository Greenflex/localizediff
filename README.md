# Localizediff

localizediff is a software that allows you to synchronize translation files in json format with SaaS translation software [localise.biz/](https://localise.biz/)

## Pré-requis

_NodeJs 8 or +_

## Installation

```bash
npm -g install localizediff
```

## Logiciel

```bash
$ localizediff --help
Usage: localizediff [options] <cmd>

Options:
  -V, --version                      output the version number
  -v, --verbose                      display verbose
  -c, --configFile [path]            path to config file localise.yml [default: './localise.yml']
  -la, --languages [languages]       array languages you needed [default:"['en']"] ex: en,fr,es,...
  -p, --pathToTranslations [path]    path to local translation folder
  -ca, --commandAfterSync [command]  command to execute after sync if translation file changed
  -l, --localisebiz [url]            url to localise.biz api [default='https://localise.biz/api']
  -k, --key [key]                    key to localise.biz/
  -f, --from [language]              language from extract
  -d, --direction [direction]        use 'down' if local changes should be overwritten [default: 'down'] ( use for sync cmd )
  -fi, --filter [filter]             Filter assets by comma-separated tag names. Match any tag with * and negate tags by prefixing with !
  -fa, --format [format]             More specific format of file type. e.g. symfony applies to php, xlf & yml [default value: 'script']
  -in, --index                       Override default lookup key for the file format: 'id', 'text' or a custom alias
  -src, --source                     Specify alternative source locale instead of project default
  -np, --namespace                   Override the project name for some language packs that use it as a key prefix
  -fb, --fallback                    Fallback locale for untranslated assets, specified as short code. e.g. en or en_GB
  -or, --order                       Export translations according to asset order
  -st, --status                      Export translations with a specific status or flag. Negate values by prefixing with !. e.g. 'translated', or '!fuzzy'.
  -pr, --printf                      Force alternative 'printf' style.
  -ch, --charset                     Specify preferred character encoding. Alternative to Accept-Charset header but accepts a single value which must be valid.
  -br, --breaks                      Force platform-specific line-endings. Default is Unix (LF) breaks.
  -nc, --noComments                  Disable rendering of redundant inline comments including the Loco banner.
  -nf, --noFolding                   Protect dot-separated keys so that foo.bar is not folded into object properties.
  -as, --async                       Specify that import should be done asynchronously (recommended for large files)
  -pa, --path                        Specify original file path for source code references (excluding line number)
  -in, --ignoreNew                   Specify that new assets will NOT be added to the project
  -ie, --ignoreExisting              Specify that existing assets encountered in the file will NOT be updated
  -tn, --tagNew                      Tag any NEW assets added during the import with the given tags (comma separated)
  -ta, --tagAll                      Tag ALL assets in the file with the given tags (comma separated)
  -uta, --unTagAll                   Remove existing tags from any assets matched in the imported file (comma separated)
  -tb, --tagAbsent                   Tag existing assets in the project that are NOT found in the imported file
  -utb, --unTagAbsent                Remove existing tags from assets NOT found in the imported file
  -da, --deleteAbsent                Permanently DELETES project assets NOT found in the file (use with extreme caution)
  -h, --help                         output usage information

  Infos:
	Open README.md
	https://www.npmjs.com/package/localizediff

  Commandes:
	sync 	 synchronize translation with localise.biz
	extract  extract key from language for others
	download downlaod translations file from localise.biz to local pathToTranslations

  Usages:
	localizediff sync
	localizediff -v -d up sync
	localizediff -f en extract
	localizediff -v -f fr extract
	localizediff -v download

```

## Configuration

### Yml file

_localize.yml_

```yaml
params:
  localisebiz: https://localise.biz/api # url to api localise.biz
  languages: ["en", "fr"] # language do you want translate
  pathToTranslations: # path to local folder with all translation files (fr.json, en.json, es.json, ...)
  key: # key read (and write) localise.biz api
  filter: # tag
  commandAfterSync: # command to execute if files changed after synchronization (ex : "make --directory=/home/my-project yarn-install")
```

> The translation files must have as name the following partern : {code ISO 639-1}.json (fr.json, en.json, zh.json, ...) [Wikipedia](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

### Env variables

_.env_

pattern: _LOCALISE\_{option.toUpperCase}={value}_

```
LOCALISE_LOCALISEBIZ=
LOCALISE_KEY=
LOCALISE_LANGUAGES=en,fr
```

> \_LOCALISE_LANGUAGES doesn't work, use in localize.yml or --languages option

### Options CMD

_localizediff [options]_

```bash
localizediff --key="" --localisebiz="" --languages=en,fr [--{option}={value}]
```

## Download

Download translation files language by language from localise.biz.

## Extract

Extract all key and value from file {--from.json} for all languages configured.

## Sync

Compare translation local files with localise.biz translation files language by language, then create final file with all translations.
If localizediff find same key with and different value, option direction (-d, --direction) will be taken.

## Advanced options

See documentation [export](https://localise.biz/api/docs/export/exportlocale) and [import](https://localise.biz/api/docs/import/import)

```yaml
params:
  localisebiz:
  key:
  languages: ["en", "fr"]
  pathToTranslations:
  commandAfterSync: # command to execute if files changed after synchronization (ex : "make --directory=/home/my-project yarn-install")
  filter:
  format:
  index:
  source:
  namespace:
  fallback:
  order:
  status:
  printf:
  charset:
  breaks:
  noComments:
  noFolding:
  async:
  path:
  ignoreNew:
  ignoreExisting:
  tagNew:
  tagAll:
  unTagAll:
  tagUpdated:
  tagAbsent:
  unTagAbsent:
  deleteAbsent:
```

## License

This project is licensed with the [MIT license](LICENSE).
