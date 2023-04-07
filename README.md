# AutoGPT Website

**Set Your Goals, AI Achieves Them.** You can set up the initial role and goals for your AI buddy, without human's supervision, it will automatically leverage all of the resources it has to achieve your goal.

Inspired by [Auto-GPT](https://github.com/Torantulino/Auto-GPT).

![Demo screenshot](.github/static/demo.gif)

## Features

- 🌐 Internet access for searches and information gathering
- 💾 Save your definition of AI, chat history and credentials in the browser
- [ ] Long-Term and Short-Term memory management
- [ ] File storage and summarization with GPT-3.5
- [ ] GPT-4 instances for text generation

## Requirements

Required:

- OpenAI API Key
- Google
  - Search API Key
  - Custom Search Engine ID

## Security

- All of your credentials will be saved in your local browser **ONLY** and be sent to the providers (OpenAI, Google Search API...) when necessary. You can remove them completely anytime.
- All of your chat history will be saved in your local browser **ONLY**. You can remove them completely anytime.

## Development

### Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
yarn dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
yarn build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
