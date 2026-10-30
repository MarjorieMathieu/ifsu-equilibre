# IFSU Équilibre · Marjorie Mathieu

Site de IFSU Équilibre (yoga Viniyoga et méditation védique IFSU), Ath, Hainaut.

https://www.ifsu-equilibre.be/

Site statique publié avec GitHub Pages. Les pages sont des fichiers HTML ; les carnets et ateliers sont dans `_carnets/` et `_ateliers/`.

Contact : ifsu@etik.com

## Modifier le site

Faire les changements dans une branche, contrôler la prévisualisation, puis fusionner la demande de modification dans `main` pour déclencher GitHub Pages. Conserver `CNAME`, le fichier de vérification Google et les licences des polices.

- Pages : modifier le fichier à la racine et sa traduction dans `en/`. Les modalités commerciales, tarifs, dates et conditions doivent correspondre dans les deux langues.
- Carnets : ajouter un fichier HTML avec en-tête YAML dans `_carnets/`, en conservant un `permalink` explicite. Le modèle `_layouts/carnet.html` ajoute déjà la signature. Ajouter la traduction correspondante dans `en/`.
- Ateliers : ajouter le programme dans `_ateliers/` avec sa date. La liste française marque automatiquement les événements passés ; maintenir aussi la liste anglaise. Ne pas inventer de nouvelles dates lors de l'archivage.
- Dates et référencement : actualiser `lastmod` dans `sitemap.xml` uniquement lorsqu'une page change réellement. Préserver les URL des articles et leurs correspondances `hreflang`.
- Clôture des inscriptions : les deux pages de découverte portent `data-registration-deadline="2026-11-02"`. Le script commun affiche « Inscriptions closes » à compter du 3 novembre, selon l'heure de Bruxelles, et masque le formulaire intégré. Cette protection d'affichage ne ferme pas le formulaire chez Tally : son accès direct et ses réglages doivent être gérés séparément.
- Informations à confirmer : ne pas inventer les frais d'annulation, les modalités de chambre ni les références ou numéros de page d'une citation. Obtenir la validation de Marjorie avant publication.

## Composants communs

`assets/site-accessibility.css` et `assets/site-accessibility.js` apportent les ajustements communs de lisibilité, de menu au clavier, de FAQ et d'affichage sans JavaScript. Conserver leurs liens dans les pages et le modèle d'article. Les couleurs et la structure générale du site restent celles des pages d'origine.

La fenêtre de retraite est réglée dans `retraite-popup.js` : période d'affichage, délai initial de 8 secondes et pages exclues. Elle est présentée une fois par session d'onglet, dans les deux langues, et ne revient pas après fermeture. Ne pas utiliser `preview: true` en production. Mettre la politique de confidentialité à jour si le fonctionnement du stockage change.

## Contrôles avant publication

Construire le site avec `jekyll build --destination /chemin/vers/apercu`, puis vérifier les pages françaises et anglaises sur ordinateur et mobile. Contrôler les menus et FAQ au clavier, les liens de réservation, les formulaires sans les envoyer, les images et la visibilité du contenu sans JavaScript. Ne pas publier les fichiers de test ni les captures d'écran dans le dépôt.

Les conditions commerciales et les mentions relatives aux données sensibles doivent correspondre au fonctionnement réel. Une revue de rédaction ne remplace pas une validation juridique.
