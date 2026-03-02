export const coursesData = [
    {
        id: 'web-basics',
        title: "HTML/CSS Builder",
        type: "Foundation",
        description: "Build a static landing page component. Perfect for beginners starting their journey.",
        duration: "2 Weeks",
        level: "Beginner",
        ctaTitle: "Ready to Build Your First Website?",
        ctaDescription: "Unlock the final modules to master Responsive Design and complete your Final Project.",
        modules: [
            { id: 1, title: "Module 1: Introduction to HTML", desc: "Understanding tags, elements, and document structure.", status: "completed", locked: false },
            { id: 2, title: "Module 2: Styling with CSS", desc: "Selectors, box model, and colors.", status: "inprogress", locked: false },
            { id: 3, title: "Module 3: Layouts with Flexbox", desc: "Building responsive layouts using Flexbox.", status: "upcoming", locked: false },
            { id: 4, title: "Module 4: Responsive Design", desc: "Media queries and mobile-first approach.", status: "upcoming", locked: true },
            { id: 5, title: "Module 5: Final Project", desc: "Building a complete landing page.", status: "upcoming", locked: true }
        ]
    },
    {
        id: 'js-logic',
        title: "JS Logic Calculator",
        type: "Foundation",
        description: "Create a functional calculator with JS. Understand DOM manipulation and logic.",
        duration: "3 Weeks",
        level: "Beginner",
        ctaTitle: "Master JavaScript Logic!",
        ctaDescription: "Get access to Event Handling and complex Calculator Logic modules.",
        modules: [
            { id: 1, title: "Module 1: JS Basics", desc: "Variables, data types, and operators.", status: "completed", locked: false },
            { id: 2, title: "Module 2: Functions & Control Flow", desc: "If-else statements, loops, and reusable code.", status: "inprogress", locked: false },
            { id: 3, title: "Module 3: DOM Manipulation", desc: "Selecting and updating elements in the browser.", status: "upcoming", locked: false },
            { id: 4, title: "Module 4: Event Handling", desc: "Making the calculator interactive with clicks.", status: "upcoming", locked: true },
            { id: 5, title: "Module 5: Calculator Logic", desc: "Implementing mathematical operations.", status: "upcoming", locked: true }
        ]
    },
    {
        id: 'react-intro',
        title: "React To-Do List",
        type: "Foundation",
        description: "Simple state management app. Learn components, props, and state.",
        duration: "3 Weeks",
        level: "Intermediate",
        ctaTitle: "Become a React Pro!",
        ctaDescription: "Unlock Form Handling and Hooks to build dynamic, state-driven applications.",
        modules: [
            { id: 1, title: "Module 1: React Fundamentals", desc: "JSX, Components, and Props.", status: "completed", locked: false },
            { id: 2, title: "Module 2: State Management", desc: "Using useState to manage data.", status: "inprogress", locked: false },
            { id: 3, title: "Module 3: Lists & Keys", desc: "Rendering multiple items efficiently.", status: "upcoming", locked: false },
            { id: 4, title: "Module 4: Form Handling", desc: "Capturing user input for new tasks.", status: "upcoming", locked: true },
            { id: 5, title: "Module 5: Hooks & Effects", desc: "Understanding useEffect for lifecycle events.", status: "upcoming", locked: true }
        ]
    },
    {
        id: 'weather-app',
        title: "Weather Dashboard",
        type: "Integration",
        description: "Fetch API data and visualize it. Master asynchronous JavaScript and APIs.",
        duration: "4 Weeks",
        level: "Intermediate",
        ctaTitle: "Integrate Real-World Data!",
        ctaDescription: "Unlock Dynamic UI Updates and Location Services to finish your Weather Dashboard.",
        modules: [
            { id: 1, title: "Module 1: Async JS & Promises", desc: "Understanding how to handle background tasks.", status: "completed", locked: false },
            { id: 2, title: "Module 2: Working with APIs", desc: "Fetching data from OpenWeatherMap.", status: "inprogress", locked: false },
            { id: 3, title: "Module 3: JSON & Data Parsing", desc: "Extracting useful info from API responses.", status: "upcoming", locked: false },
            { id: 4, title: "Module 4: Dynamic UI Updates", desc: "Updating the dashboard based on weather data.", status: "upcoming", locked: true },
            { id: 5, title: "Module 5: Location Services", desc: "Integrating browser geolocation.", status: "upcoming", locked: true }
        ]
    },
    {
        id: 'e-commerce-ui',
        title: "E-Commerce UI",
        type: "Integration",
        description: "Product grid with cart functionality. Complex state management and routing.",
        duration: "5 Weeks",
        level: "Advanced",
        ctaTitle: "Launch Your E-Commerce Store!",
        ctaDescription: "Unlock Context API and Checkout Simulation to build a complete shopping experience.",
        modules: [
            { id: 1, title: "Module 1: Advanced Components", desc: "Building reusable product cards and grids.", status: "completed", locked: false },
            { id: 2, title: "Module 2: React Router", desc: "Implementing navigation between pages.", status: "inprogress", locked: false },
            { id: 3, title: "Module 3: Cart Logic", desc: "Managing shopping cart state globally.", status: "upcoming", locked: false },
            { id: 4, title: "Module 4: Context API", desc: "Using Context for theme and user data.", status: "upcoming", locked: true },
            { id: 5, title: "Module 5: Checkout Simulation", desc: "Handling form validation and payment UI.", status: "upcoming", locked: true }
        ]
    },
    {
        id: 'full-stack-social',
        title: "Social Network Platform",
        type: "Capstone",
        description: "Full MERN stack application with auth. The ultimate portfolio project.",
        duration: "12 Weeks",
        level: "Expert",
        ctaTitle: "Build a Full-Stack Empire!",
        ctaDescription: "Unlock Real-time features with Socket.io and master Cloud Deployment.",
        modules: [
            { id: 1, title: "Part 1: Backend Architecture & API Design", desc: "Setup Node.js server, Express routes, and MongoDB schemas.", status: "completed", locked: false },
            { id: 2, title: "Part 2: Frontend Fundamentals & Auth", desc: "React setup, Redux for state, and JWT Authentication flows.", status: "inprogress", locked: false },
            { id: 3, title: "Part 3: Advanced UI Components", desc: "Building the Feed, Profile, and dynamic interactions.", status: "upcoming", locked: false },
            { id: 4, title: "Part 4: Real-time Features (WebSocket)", desc: "Implementing chat and notifications with Socket.io.", status: "upcoming", locked: true },
            { id: 5, title: "Part 5: Deployment & CD/CI", desc: "Deploying to cloud (AWS/Heroku) and setting up pipelines.", status: "upcoming", locked: true }
        ]
    }
];
