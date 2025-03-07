# ThemIsle Internship Test

Welcome! This test consists of a series of practical tasks designed to evaluate your skills and familiarity with web applications.

## Evaluation Criteria

The following criteria will be assessed:

- **Code Abstraction** – The quality of function and variable names, modularity, and overall code organization.
- **Database Management** – Efficiency in handling queries, caching, and data operations.
- **User Interface (UI) & User Experience (UX)** – Ease of interaction, readability, and overall intuitiveness of the interface.
- **Performance** – Speed and efficiency in loading and processing data.

## Implementation Guidelines

You have complete freedom in how you approach the task. Feel free to install any libraries that you find useful.

### Additional Notes

- You are encouraged to use **AI tools** to assist in solving the task. However, you should be able to justify your choices and fully understand the decisions made in the application.
- This project structure was initially built using **Bun** for ease of use and quick setup. However, if you prefer a different environment, we recommend using **Node.js** or **PHP** (Laravel, Headless WordPress, etc.).
- For UI design, you are free to choose any style that best suits this type of application. Our main focus is on the solutions you implement to enhance user interaction and experience. **Animations are great, but use them in moderation**.
- The **database schema** can be modified as needed. If you make any changes, please attach a **comment explaining the reason** for the modification (e.g., improving ease of use, performance optimization, caching efficiency, etc.).
- When implementing new **API endpoints**, ensure **robust error handling** that properly communicates with the UI.
- When designing the UI, **make it responsive**. Consider the experience of users on **mobile devices and tablets**.
- You can share your experience in the [Feedback](./FEEDBACK.md) file. Examples:
  - What was the most challenging part?
  - Which aspects of the application did you enjoy implementing?
  - Any suggestions for improvement?

### Submitting the solution

After completing the task, please add screenshots of the application to the `screenshots` folder. You can also add videos.

We recommend posting your solution on a Git platform (GitHub preferred) and sending us the repository link. If you want to add videos but the platform doesn't allow them due to size limits, you can use any video platform and include the links in the `FEEDBACK.md` file.

Good luck! 🚀

## Story (Introduction)

Alberto Rodrigo was a proud inventor of BitScam, a quirky digital currency favored by an exclusive club in the vibrant heart of Barcelona. Though his app was straightforward, Alberto's users were often left frustrated by their experience.

They frequently complained about unbearably long loading times, excessive memory usage that repeatedly crashed their browsers, a glaring absence of transaction filters, and a perplexing process of adding transactions—one that involved personally emailing Alberto each time.

Despite being well aware of these shortcomings, Alberto found himself content with how things were running, especially given the remarkable profits the app generated.

One sunny afternoon, while indulging his success at the Porsche store, Alberto's phone buzzed frantically with a news alert. His heart skipped a beat as he read that BitScam had caught the eye of international media. Almost immediately, a wave of enthusiastic emails from potential customers flooded his inbox. Filled with confidence and excitement, Alberto even considered heading straight to the Ferrari dealership.

However, his joy was abruptly shattered by another alert. His hands began to tremble, sweat streaming down his forehead as he read the alarming news: a group of talented dropouts from Harvard, Stanford, and MIT had secured a staggering $50 million from heavyweight investors like gCombinator and s9t. Their ambitious mission? Transform BitScam into a global currency supported by the largest trading platform ever built.

Panic surged through Alberto. The sudden realization that his cherished business could become obsolete overnight struck him hard. Determined, he rushed home, feverishly attempting to upgrade his outdated app, desperately hoping his loyal users wouldn't desert him immediately.

Yet, Alberto faced a daunting obstacle—he was hopelessly out of touch with current technology. His app had run almost effortlessly for 15 long years, requiring minimal attention. Feeling overwhelmed by the latest tech jargon and trends, Alberto stumbled upon communities buzzing about "vibe coding" and powerful AI tools that made his simple methods seem prehistoric.

Brimming with hopeful enthusiasm, Alberto dove headfirst into this world of "vibe coding." But after a week of relentless trial and error, his app fell apart, suffocating under an avalanche of unfamiliar libraries and frameworks. Lost in a sea of confusing terminology—shadcn, vite, useEffect, end-to-end tests, smoke tests, web components, NoSQL databases, AI agents—Alberto felt defeated. Frustrated and bewildered, he wondered aloud, "Why all this complexity when I built everything with a humble $2 VPS and Notepad++ from a cozy coffee shop?"

In that humbling moment, Alberto understood he couldn't do it alone. He urgently needed someone well-versed in modern technology—someone who could help him reclaim the future he once saw clearly.

#### What is a BitScam?

A BitScam is a hash generate using Alberto's secret formula. You take 3 random numbers from range 1 to 10 and combine using a special combination then feed it to `md5` hash function. With this formula, Alberto can generated up to 1000 BitScams.

### Tasks

Alberto has outlined the following clear requirements to modernize and enhance the usability of the BitScam application:

#### User Registration (Sign-Up Page)

- Develop a secure and intuitive sign-up page.
- Allows new users to easily register.
- Create a new account.

#### User Authentication (Login Page)

- Implement a secure and straightforward login page.
- After login, the user will have access to a profile page where they can see:
  - Total number of transactions associated with their account.
  - Total amount of BitScam currency they currently own.
  - Total amount of BitScam monetary value they currently own.

#### Transaction Dashboard Enhancements

- Create a user-friendly transaction dashboard.
- Introduce pagination:
  - Have a selector for 15, 30, 50 transactions per page.
  - Easy navigation across multiple pages (e.g., pages 50, 49...2, 1).
- Enable users to filter transactions by:
  - **Date range** (specific start and end dates).
  - **BitScam currency value range**.
  - **Buyer name**.
  - **Seller name**.

#### User Experience

- Improve the loading speed of the transaction dashboard.
- Implement visual elements that notify users when an error occurs.
- (Challenge) Live Refresh the transitions dashboard when a new transaction is created.

#### Buy BitScams

Create a page where all the available BitScams are shown (with a pagination of 30 items per page). Each list item will display the BitScam hash, its components, its value and the current owner (if it exists) along with a Buy button (if the user does not already own it). When the user press Buy, a new transaction will be registered and the owner of the coin will change (the amount value does not matter, it just a vanity value).

In the page will be another button named `Generate Coin` where after pressing, the user will asked to introduce an amount (the display can be a modal, new page or inline elements).

To generate a BitScam, find 3 random numbers and their combination must be unique (do not insert a BitScam that has its components already present). If no more BitScam can be generated, the `Generate Coin` should be hidden.

### Working with Bun

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

To run tests:

```bash
bun test
```
