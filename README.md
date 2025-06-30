
# Visualizador y Tester de Expresiones Regulares (Regex)

Aplicación móvil desarrollada en **React Native** con **TypeScript** que permite escribir, probar y visualizar expresiones regulares mediante:

- Resultados de coincidencias en texto.
- Árbol de Sintaxis Abstracta (AST).
- Diagrama de ferrocarril de la expresión.
- Diagrama de las coincidencias.
- Exportación como imagen.
- Historial de patrones guardados con persistencia local (SQLite + Zustand).


## Features

- ✅ Tester interactivo

Escribe una expresión regular y texto de prueba.

Verás las coincidencias resaltadas dinámicamente.

- 🌳 AST (Árbol de Sintaxis Abstracta)

Visualización jerárquica del patrón con indentación clara.

- 🚉 Diagrama de ferrocarril

Visualización vertical optimizada para dispositivos móviles.

Usa regexpp para descomponer los nodos.

- 🧩 Coincidencias agrupadas

Diagrama separado para los matches, incluyendo subgrupos capturados.

- 💾 Historial persistente

Guarda automáticamente patrones y textos usados.

Visualízalos en una pantalla dedicada (RegexHistoryScreen).

Usa SQLite + Zustand para persistencia reactiva.

- 🖼️ Exportar resultados

Guarda el diagrama como imagen (PNG).



## Requisitos previos
- Node.js ≥ 18

- Expo CLI (npm install -g expo-cli)

- SQLite disponible en el entorno (Expo lo gestiona automáticamente)

- Dispositivo o emulador Android/iOS
## Installation

Instala las dependencias con:

```bash
  npm install
```
    
## Deployment

Para correr este proyecto usa: 

```bash
  npx expo start
```


## 🧼 Arquitectura usada
🏗️ Clean Architecture + MVVM + Feature-First

- MVVM: Cada feature tiene su ViewModel que gestiona estado local.

- CLEAN: Separación clara entre domain, data, view, store.

- Feature First: Todo lo relacionado con una feature vive en su carpeta.

- Atomic Design: UI dividida en atoms, molecules, organisms.
## Usage/Examples
Expresión:
```scss
(\w+)@(\w+)\.(com|org)

```
Texto de prueba:
```scss
Correo: prueba@openai.com y otro: user@domain.org

```
La app te mostrará los matches, subgrupos capturados y su estructura sintáctica.
## Acknowledgements

  - [Readme Editor](https://readme.so/editor)
  - [EXPRESIONES REGULARES Desde Cero](https://www.youtube.com/watch?v=MRKpVxn5fqI)
 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)


## Authors

- [Santiago Larrache Pool](https://github.com/xunxuno)


## License

[MIT](https://choosealicense.com/licenses/mit/)


## 🛠 Skills
Typescript, React native, CSS


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://github.com/xunxuno?tab=repositories)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/santiago-larrache-pool-76758b258/)


