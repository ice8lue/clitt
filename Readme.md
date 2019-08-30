# CLITT
## Command line time tracker

CLITT is a simple app to effortlessly track time ranges with one command only. It supports multiple projects and additional data fields.

## Installation

Install via NPM:
`$ npm install -g clitt`

or use yarn
`$ yarn global add clitt`

## Usage

`$ clitt` - that's it. Called for the first time, it will create a new track, called a second time, the track is finished.

Use `$ clitt -p <PROJECT_NAME>` to track for a specific project. While there can be only one open track for a given project, there may be multiple open tracks for multiple projects.

Project configurations and entries will be stored in `~/.clitt/<PROJECT_NAME>.json`.

To define custom data fields, adjust the project config file:

```json
{
  "title": "Sample project",
  "entries": [],
  "fields": [

    // Simple input prompt
    {
      "id": "task",
      "title": "Task description"
    },

    // Selection list prompt
    {
      "id": "category",
      "title": "Category",
      "values": [
        "Work",
        "Home",
        "Garden",
        "Car"
      ]
    }
  ]
}
```

## Contributions
Found a bug? Missing a feature? I'm always happy about forks and PRs 😉

## License

MIT - see LICENSE

