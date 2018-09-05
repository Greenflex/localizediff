# Traduire avec localise.biz sous Symfony

> La documentation est faite sous Symfony 4 mais le liens sont sous Symfony 3 (23 aôut 2018)

## Installation

**0. Preparation du projet coté localise.biz**

[Voir la documentation sur LocaliseBizSync](./README.md#localisebiz)

**1. Installation du bundle de traduction Symfony**

https://github.com/php-translation/symfony-bundle

```bash
composer require php-translation/symfony-bundle
```

> Verifiez dans config/bundle que le bundle soit bien installé

**2. Installation de l'adaptateur localise.biz**

https://github.com/php-translation/loco-adapter

```bash
composer require php-translation/loco-adapter
```

config/bundle.php

```php
....
Translation\PlatformAdapter\Loco\Bridge\Symfony\TranslationAdapterLocoBundle::class => ['all' => true],
```

**3. Configurer les bundles**

https://php-translation.readthedocs.io/en/latest/guides/using-loco-adapter.html

config/packages/php_translation.yaml

```yaml
translation:
  locales: ["fr", "en"]
  edit_in_place:
    enabled: false
    config_name: app
  configs:
    app:
      dirs: ["%kernel.project_dir%/templates", "%kernel.project_dir%/src"]
      output_dir: "%kernel.project_dir%/translations"
      excluded_names: ["*TestCase.php", "*Test.php"]
      excluded_dirs: [cache, data, logs]
      remote_storage: ["php_translation.adapter.loco"]

translation_adapter_loco:
  index_parameter: # 'text' or 'name'. Leave blank for "auto"  See https://localise.biz/api/docs/export/exportlocale
  projects:
    acme:
      api_key: "R6gNpRPZM_tzN4Kti2AR86AKow7J0DASf" # API key read/write
      domains: ["messages", "messages"]
```

> `domains` correspond aux domaines de traduction par exemple pour les formulaire avec le fichier forms.yaml le domaine sera forms donc `domains: ["messages", "forms"]` qui prendront comme forme sur localise.biz de tag

**3. Extraire les fichiers de traduction**

```bash
php bin/console translation:extract
```

_La commande `translation:extract` va extraire toutes les traductions comprises dans les fichiers de traduction pour les mettres au format xliff ainsi que les clés trouvé dans les fichiers twig_

> Il est conseillé à chaques nouvelle clé crée dans un twig de relancer la commande translation:extract afin de mettre à jours le fichier de traduction dans les normes

> À partir de maintenant, si les anciens fichier de traduction n'était pas au format xliff, de les supprimer

**4. Synchroniser les fichiers de traduction Symfony vers localise.biz**

```bash
php bin/console translation:sync app up
```

Si l'erreur suivante s'affiche

```
No HTTPlug clients found. Make sure to install a package providing "php-http/client-implementation". Example: "php-http/guzzle6-ad
  apter".
```

installer le client http guzzle `composer require php-http/httplug-bundle php-http/curl-client guzzlehttp/psr7`

https://github.com/php-http/HttplugBundle

# Cas utilisations

**1. Le projet est sur un serveur recette, ux ou prod**

- _J'ai_

  Le projet est installé sur un serveur de prod

- _Je veux_

  Je veux que la traduction se met automatiquement à jours si un product owner change du texte

_Étape n°1 : Création d'un cron toutes les 15 minutes_

`*/30 * * * * php /path/to/project/bin/console translation:sync app --env=prod && /path/to/project/bin/console cache:warmup --env=prod --no-interaction`

**2. Mettre à jours mon environement de développement**

- _J'ai_

  Le Product Owner a mis à jours la traduction sur localise.biz

- _Je veux_

  Je veux mettre à jours mon environnement de développement

_Étape n°1 : Synchroniser les traductions de localise.biz vers mon locale_

```bash
$ php bin/console translation:sync app
```

**3. Mettre à jours localise.biz**

- _J'ai_

  J'ai fait une modification en local

- _Je veux_

  Je veux mettre à jours ma version sur localise.biz

_Étape n°1 : Synchroniser les traductions du local vers localise.biz_

```bash
$ php bin/console translation:sync app up
```

**4. Je ne veux pas que mes fichiers de traduction soient sur mon logiciel de gestion de versions Git**

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
$ php bin/console translation:download
```
