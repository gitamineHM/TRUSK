# TRUSK

- Install Redis server 
- Do node tool.js
- Enjoy

## Context

Dans le but de simplifier la relation avec les Truskers, Trusk souhaite faciliter leur onboarding à travers le chat bot qu'ils utilisent déjà à ce jour pour la saisie des courses.

Le but de l'exercice est de permettre la saisie de leurs informations de profil à travers un outil en ligne de commande.

Les informations à saisir sont:

- Le nom du trusker
- Le nom de la société
- Le nombre d'employés
- Pour chaque employé son nom
- Le nombre de camion
- Pour chaque camion le volume en m³ du camion
- Le type de camion

Chaque champs doit saisir une information valide, si l'information est invalide ou vide la question doit être posée à nouveau.

À la fin de la saisie des informations, on les affiche et on prompt à nouveau "Les informations sont elles valides?" si non on recommence au début.

On stocke les réponses dans redis. Si on coupe le tool au milieu de l'onboarding et qu'on le relance, les réponses précédentes sont affichées et le tool saute automatiquement à la prochaine question. A la fin le redis est vidé.

Technos utilisées:

- NodeJS
- https://www.npmjs.com/package/inquirer
- async/await
- ES6 Promise https://www.npmjs.com/package/bluebird
- https://www.npmjs.com/package/redis
- Map, Filter, Reduce
