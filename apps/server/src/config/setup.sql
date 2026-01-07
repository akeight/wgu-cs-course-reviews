BEGIN;

DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS review_votes CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS resources CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id         SERIAL PRIMARY KEY,
    email      VARCHAR(255) NOT NULL UNIQUE,
    username   VARCHAR(50)  NOT NULL UNIQUE,
    avatar     VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id          SERIAL PRIMARY KEY,
    course_code VARCHAR(10) NOT NULL UNIQUE,
    title       VARCHAR(150) NOT NULL,
    description VARCHAR(500),
    credits     INTEGER NOT NULL CHECK (credits > 0),
    has_project BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resources (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER NOT NULL,
    course_id  INTEGER NOT NULL,
    title      VARCHAR(100) NOT NULL,
    url        VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_resources_course_id ON resources(course_id);

CREATE TABLE reviews (
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER NOT NULL,
    course_id      INTEGER NOT NULL,
    rating         NUMERIC(2,1) NOT NULL CHECK (rating BETWEEN 1 AND 5),
    difficulty     INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
    hours_per_week INTEGER NOT NULL CHECK (hours_per_week >= 0),
    review_text    VARCHAR(1000) NOT NULL,
    upvotes        INTEGER NOT NULL DEFAULT 0 CHECK (upvotes >= 0),
    downvotes      INTEGER NOT NULL DEFAULT 0 CHECK (downvotes >= 0),
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_reviews_course_id ON reviews(course_id);

CREATE TABLE review_votes (
    user_id    INTEGER NOT NULL,
    review_id  INTEGER NOT NULL,
    vote_type  VARCHAR(4) NOT NULL CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, review_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);

CREATE INDEX idx_review_votes_review_id ON review_votes(review_id);

CREATE TABLE enrollments (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL,
    course_id   INTEGER NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Seed users (derived from mockReviews userName; random cat avatars)
INSERT INTO users (id, email, username, avatar) VALUES
  (1, 'sarah.johnson@example.com',  'sarahjohnson',  'https://cataas.com/cat?seed=sarah'),
  (2, 'mike.chen@example.com',      'mikechen',      'https://cataas.com/cat?seed=mike'),
  (3, 'emily.rodriguez@example.com','emilyrodriguez','https://cataas.com/cat?seed=emily'),
  (4, 'david.kim@example.com',      'davidkim',      'https://cataas.com/cat?seed=david'),
  (5, 'jessica.brown@example.com',  'jessicabrown',  'https://cataas.com/cat?seed=jessica'),
  (6, 'alex.turner@example.com',    'alexturner',    'https://cataas.com/cat?seed=alex');
-- Seed courses (IDs align with mockCourses ids; code -> course_code, name -> title)
INSERT INTO courses (id, course_code, title, description, credits, has_project) VALUES
  (1,  'D684', 'Introduction to Computer Science', 'Overview of CS concepts, problem solving, and how software/hardware interact.', 4, FALSE),
  (2,  'C955', 'Applied Probability and Statistics', 'Core statistics: descriptive stats, probability, regression, and inference for IT use.', 3, FALSE),
  (3,  'D278', 'Scripting and Programming - Foundations', 'Programming basics and logic with simple scripts and control structures.', 3, FALSE),
  (4,  'D426', 'Data Management - Foundations', 'Relational concepts, modeling, normalization, and SQL fundamentals.', 3, FALSE),
  (5,  'D315', 'Network and Security - Foundations', 'Networking models, protocols, and basic security concepts for IT systems.', 3, FALSE),
  (6,  'C958', 'Calculus I', 'Limits, derivatives, and integrals with applications relevant to computing.', 4, FALSE),
  (7,  'D276', 'Web Development Foundations', 'HTML, CSS, and basic web-building principles.', 3, FALSE),
  (8,  'D427', 'Data Management - Applications', 'Applied SQL queries, joins, stored routines, and practical data tasks.', 4, FALSE),
  (9,  'D197', 'Version Control', 'Git essentials: repos, branching, merging, and collaboration workflows.', 1, TRUE),
  (10, 'D685', 'Practical Applications of Prompt', 'Using AI tools effectively: prompting, evaluation, and responsible use.', 2, TRUE),
  (11, 'C867', 'Scripting and Programming - Applications', 'Applied programming projects that reinforce software construction skills.', 4, TRUE),
  (12, 'D459', 'Introduction to Systems Thinking and Applications', 'Modeling complex systems, feedback loops, and holistic problem analysis.', 3, TRUE),
  (13, 'C959', 'Discrete Mathematics I', 'Logic, sets, functions, counting, and proofs for computing.', 4, FALSE),
  (14, 'D268', 'Introduction to Communication: Connecting with Others', 'Professional communication, presentations, and message design.', 3, TRUE),
  (15, 'C952', 'Computer Architecture', 'Processors, memory, I/O, and performance within modern architectures.', 3, FALSE),
  (16, 'C683', 'Natural Science Lab', 'Hands-on lab activities and reporting across general science topics.', 2, TRUE),
  (17, 'D286', 'Java Fundamentals', 'Core Java syntax, OOP, and basic application building.', 3, TRUE),
  (18, 'C960', 'Discrete Mathematics II', 'Graphs, trees, recurrence, and complexity foundations.', 4, FALSE),
  (19, 'D270', 'Composition: Successful Self-Expression', 'Academic writing, argumentation, and revision strategies.', 3, TRUE),
  (20, 'C963', 'American Politics and the US Constitution', 'US political institutions, constitutional principles, and civic processes.', 3, FALSE),
  (21, 'D287', 'Java Frameworks', 'Building Java apps with frameworks and patterns (e.g., Spring).', 3, TRUE),
  (22, 'D281', 'Linux Foundations', 'Linux CLI, filesystems, permissions, and basic administration.', 3, FALSE),
  (23, 'D430', 'Fundamentals of Information Security', 'Security principles, threats, controls, and risk basics.', 3, FALSE),
  (24, 'D288', 'Back-End Programming', 'Server-side programming, APIs, and data access patterns.', 3, TRUE),
  (25, 'D686', 'Operating Systems for Computer Scientists', 'Processes, threads, memory, scheduling, and OS design tradeoffs.', 3, FALSE),
  (26, 'D387', 'Advanced Java', 'Multithreading, deployment, and advanced OOP in Java.', 3, TRUE),
  (27, 'D333', 'Ethics in Technology', 'Ethical frameworks, policy, and societal impacts of technology.', 3, TRUE),
  (28, 'C949', 'Data Structures and Algorithms I', 'Lists, stacks, queues, trees, hashing; big-O and OOP design; implement small apps.', 4, FALSE),
  (29, 'D336', 'Business of IT - Applications', 'ITIL-style service management practices and value delivery.', 4, FALSE),
  (30, 'D284', 'Software Engineering', 'Software processes, requirements, design, and quality fundamentals.', 4, FALSE),
  (31, 'C458', 'Health, Fitness, and Wellness', 'Personal wellness concepts and health literacy.', 4, FALSE),
  (32, 'C950', 'Data Structures and Algorithms II', 'Graphs, hashing, self-adjusting structures, dynamic programming, NP-completeness.', 4, FALSE),
  (33, 'D480', 'Software Design and Quality Assurance', 'Design tradeoffs, architectural reasoning, and rigorous QA/verification artifacts.', 3, TRUE),
  (34, 'D429', 'Introduction to AI for Computer Scientists', 'AI history, terminology, ethics, and high-level reasoning/knowledge concepts.', 2, TRUE),
  (35, 'D682', 'Artificial Intelligence Optimization for Computer Scientists', 'Implementing and tuning AI approaches; testing and adapting models for scenarios.', 3, TRUE),
  (36, 'D683', 'Advanced AI and ML', 'Plan and deliver a functional ML/AI product addressing a business problem.', 3, TRUE),
  (37, 'D687', 'Computer Science Project Development with a Team', 'Team artifacts and executive/technical proposal packaging for a prior project.', 3, TRUE);
-- Seed resources (assign to user_id=1 since mock data has no owner)
INSERT INTO resources (user_id, course_id, title, url) VALUES
  (1, 28, 'LeetCode Patterns Guide', 'https://leetcode.com/discuss/study-guide'),
  (1, 28, 'Big O Notation Cheat Sheet', 'https://www.bigocheatsheet.com'),
  (1, 28, 'Visualgo - Algorithm Visualizations', 'https://visualgo.net'),
  (1, 1,  'CS50 Lectures', 'https://cs50.harvard.edu'),
  (1, 11, 'Learn C++ Tutorial', 'https://www.learncpp.com');
-- Seed reviews (content -> review_text; timePerWeek -> hours_per_week)
INSERT INTO reviews (user_id, course_id, rating, difficulty, hours_per_week, review_text, upvotes, downvotes, created_at) VALUES
  (1, 28, 5, 4, 15, 'This course was challenging but incredibly rewarding, and the problem sets steadily build confidence. The algorithm problems really helped solidify my understanding and made interviews feel less intimidating. Make sure you practice every day and reflect on mistakes to improve. most cats sleep 12 to 16 hours a day. The consistent routine matters here too—short daily reps beat long weekend marathons.', 24, 2, '2024-10-15'),
  (2, 28, 4, 3, 12, 'Great introduction to DSA with balanced theory and practice. The course material is comprehensive and the feedback is timely. Finished in about 3 weeks with prior experience and lots of small practice sessions. a group of cats is called a clowder. Expect steady progress if you keep your sessions focused and frequent.', 18, 1, '2024-09-20'),
  (3, 28, 3, 4, 20, 'The course is good but I found the pacing to be fast, especially early on. Make sure you have a solid foundation before starting and don''t skip the warm-ups. cats can rotate their ears 180 degrees. The attention to small details in problems mirrors that kind of focus.', 12, 3, '2024-08-10'),
  (4, 2,  5, 2, 10, 'Perfect starting course with approachable explanations and supportive examples. Very beginner-friendly and the instructor is excellent at breaking ideas down. Completed in 2 weeks by studying a little every day. cats have whiskers that help them judge spaces. Likewise, rely on quick checks to gauge whether you understand each topic before moving on.', 30, 0, '2024-10-01'),
  (5, 1,  4, 3, 15, 'Good overview of CS fundamentals that ties concepts together across modules. Some parts felt rushed but overall it''s a solid introduction with clear milestones. a cat''s nose print is unique like a fingerprint. Use that mindset to identify your weak topics and target them precisely. The more you iterate, the more the big picture locks in.', 15, 1, '2024-09-12'),
  (6, 11, 4, 4, 18, 'C++ can be tricky if you''re coming from Python, so expect a mindset shift. The PA is comprehensive and tests everything from memory to style. Build small projects to internalize the quirks. cats often purr when content and sometimes when stressed. Keep your pace steady and you''ll stay on top of the complexity.', 22, 2, '2024-08-25');
 
 INSERT INTO enrollments (user_id, course_id) VALUES
    (1, 1),
    (1, 2),
    (2, 2);

-- Additional randomized reviews to ensure 2–5 per course
-- Difficulty is estimated from course description; ratings and votes vary
INSERT INTO reviews (user_id, course_id, rating, difficulty, hours_per_week, review_text, upvotes, downvotes) VALUES
  -- 1 Introduction to CS (difficulty ~2)
  (2, 1, 4, 2, 8, 'Solid overview with a gentle ramp up and friendly pacing. The examples connect ideas across modules and build momentum. cats can rotate their ears 180 degrees. If you review a little each day, the terms and patterns really stick.', 14, 1),
  (3, 1, 5, 2, 7, 'Great starter course that ties concepts together and sets expectations clearly. The quizzes are short but effective at reinforcing recall. a group of cats is called a clowder. Consistency beats cramming here, so keep sessions short and focused.', 19, 0),
  -- 2 Applied Probability and Statistics (already 1 review; add 2, difficulty ~3)
  (1, 2, 4, 3, 10, 'Clear explanations and practical examples that map nicely to IT scenarios. The practice problems are where everything clicks into place. cats have 230 bones, more than humans. Keep a formula sheet and annotate it as you go to reduce friction.', 12, 1),
  (6, 2, 3, 3, 12, 'Some sections were dense but fair once you work a few examples. The key is pacing yourself and reviewing the interpretations. cats have whiskers that help them judge spaces. Use quick checkpoints to see if you understand the why behind each result.', 8, 2),
  -- 3 Scripting and Programming - Foundations (difficulty ~2)
  (4, 3, 4, 2, 8, 'Good intro to scripting with frequent practice and bite-sized tasks. The structure keeps you from getting stuck too long. cats can make over 100 vocalizations. Write small functions and refactor often to learn faster.', 11, 0),
  (5, 3, 5, 2, 7, 'Approachable and fun exercises with quick feedback. The incremental projects make progress visible and motivating. a cat''s nose print is unique like a fingerprint. Keep a journal of patterns you discover as you code.', 16, 0),
  -- 4 Data Management - Foundations (difficulty ~2)
  (2, 4, 4, 2, 9, 'Normalization and SQL basics were well paced and thoughtfully sequenced. The labs make relational concepts tangible. most cats land on their feet due to a righting reflex. Diagram your schemas and relationships to build intuition.', 10, 1),
  (3, 4, 3, 2, 8, 'Good fundamentals with helpful labs that emphasize precision. The pacing leaves room for review without feeling slow. cats can rotate each ear independently to pinpoint sounds. Keep queries small and compose them step by step.', 7, 1),
  -- 5 Network and Security - Foundations (difficulty ~3)
  (1, 5, 4, 3, 11, 'Solid coverage of models and threats with memorable examples. The labs give just enough hands-on work to anchor the terms. purring may aid healing through low frequency vibrations. Build a glossary and revisit it before each session.', 13, 1),
  (6, 5, 3, 3, 12, 'Protocols took repetition but they clicked after practicing packet flows. Visuals helped me keep the layers straight. cats can sprint up to about 30 mph in short bursts. Plan review sprints near the end to cement vocabulary.', 9, 2),
  -- 6 Calculus I (difficulty ~4)
  (4, 6, 4, 4, 16, 'Challenging but rewarding with consistent effort and active recall. The worked examples clarify tricky steps. cats have flexible spines enabling agile movement. Expect to revisit limits and derivatives multiple times before it gels.', 17, 3),
  (5, 6, 3, 4, 18, 'Expect a lot of practice on limits and derivatives with gradual improvement. The assessments reward neat, organized work. the first cat in space was Félicette in 1963. Make a mistake log and redo those problems after a day or two.', 12, 4),
  -- 7 Web Development Foundations (difficulty ~2)
  (2, 7, 5, 2, 8, 'Great hands-on HTML and CSS with instant feedback from the browser. Small wins come quickly and keep you motivated. cats use whiskers to sense openings and obstacles. Build simple pages daily and experiment with layouts.', 15, 0),
  (3, 7, 4, 2, 7, 'Clear steps and quick wins that build momentum. The examples show common patterns you''ll reuse later. cats cannot taste sweetness due to a gene mutation. Keep a component library of snippets you like.', 10, 1),
  -- 8 Data Management - Applications (difficulty ~3)
  (1, 8, 4, 3, 12, 'Joins and routines felt practical and directly applicable at work. The scenarios make tradeoffs clear. cats can rotate each ear independently to pinpoint sounds. Practice explain plans to understand performance impacts.', 11, 1),
  (6, 8, 3, 3, 13, 'Applied SQL work was fair with steady practice and careful reading. Debugging queries builds confidence fast. cats often communicate with subtle tail movements. Keep test data sets so you can iterate quickly.', 8, 2),
  -- 9 Version Control (difficulty ~1)
  (4, 9, 5, 1, 5, 'Easy to pick up and very useful for everyday work. Branching and merging become second nature with repetition. cats walk with a precise direct register like camels and giraffes. Create small repos to practice isolated workflows.', 18, 0),
  (5, 9, 4, 1, 4, 'Short and impactful; branching clicks fast once you compare diffs. The visual mental model makes everything simpler. cat whiskers are as wide as their body to judge gaps. Keep your commit messages crisp and specific.', 12, 0),
  -- 10 Practical Applications of Prompt (difficulty ~2)
  (2, 10, 5, 2, 7, 'Practical workflows and quick feedback loops keep you engaged. The rubric emphasizes clarity and iteration. cats have a reflective eye layer that aids night vision. Save prompt templates and refine them as you learn.', 20, 1),
  (3, 10, 4, 2, 6, 'Good balance of technique and ethics with realistic tasks. You learn to evaluate outputs, not just generate them. many cats chirp when excited by birds outside. Keep a changelog of what improved each attempt.', 9, 1),
  -- 11 Scripting and Programming - Applications (already 1; add 2, difficulty ~3-4)
  (1, 11, 4, 3, 14, 'Projects reinforce concepts well and expose weak spots. The workload is steady but manageable with planning. cats can jump up to six times their length. Break tasks into small deliverables to stay on track.', 13, 1),
  (2, 11, 5, 4, 16, 'Heavier workload but satisfying builds that feel like real work. The rubric rewards robust tests and clear structure. most cats groom to regulate temperature and scent. Iteration speed and refactoring discipline matter a lot.', 16, 2),
  -- 12 Systems Thinking (difficulty ~2)
  (4, 12, 4, 2, 8, 'Interesting models and feedback loops with memorable examples. The diagrams help internalize causal links. cats knead as a comforting behavior from kittenhood. Spend time naming system boundaries precisely.', 10, 1),
  (6, 12, 3, 2, 7, 'Light math and heavy diagrams make it approachable. The activities reward careful observation. cats often blink slowly to show trust. Write narrative summaries of each model to clarify assumptions.', 7, 2),
  -- 13 Discrete Mathematics I (difficulty ~4)
  (3, 13, 4, 4, 16, 'Proofs took time but pay off once templates click. The exercises reward precision over speed. cats have retractable claws that stay sharp. Space sessions out and revisit proofs to cement steps.', 12, 3),
  (5, 13, 3, 4, 15, 'Counting and logic require discipline and lots of practice. Pacing yourself makes the material more manageable. many cats trill to greet their humans. Keep a list of common pitfalls and review it weekly.', 8, 4),
  -- 14 Communication (difficulty ~1)
  (1, 14, 5, 1, 5, 'Low stress with practical speaking practice and clear rubrics. The feedback focuses on structure and clarity. cats have excellent peripheral vision. Record practice runs and calibrate your timing.', 14, 0),
  (2, 14, 4, 1, 4, 'Useful frameworks for presentations and audience analysis. You get results quickly with a bit of rehearsal. kittens are born with blue eyes that change later. Build slides that guide the story rather than overwhelm.', 9, 1),
  -- 15 Computer Architecture (difficulty ~4)
  (4, 15, 4, 4, 16, 'Dense but fascinating; diagrams and tables help more than prose. The course rewards careful reading and steady practice. cats can make a chirrup sound as a friendly greeting. Summarize each component as inputs, outputs, and tradeoffs.', 11, 2),
  (6, 15, 3, 4, 17, 'Expect careful reading on memory and caches along with patience. Building a glossary early pays off later. cats are digitigrade and walk on their toes. Rehearse the big picture before diving into details.', 7, 3),
  -- 16 Natural Science Lab (difficulty ~2)
  (3, 16, 4, 2, 8, 'Labs were straightforward and well guided with clear steps. The reports mirror the hands-on work closely. cats use tail position to communicate mood. A simple checklist kept me consistent across labs.', 10, 1),
  (5, 16, 4, 2, 9, 'Reports mirror the lab steps closely and highlight key observations. The timelines felt reasonable and predictable. many cats can find their way home using scent and sun position. Keep your templates tidy to save time.', 9, 1),
  -- 17 Java Fundamentals (difficulty ~3)
  (1, 17, 4, 3, 12, 'Solid baseline for OOP with a good ramp-up. Small projects help you internalize the core patterns. cats have specialized collarbones that aid balance. Commit code often and refactor mercilessly.', 12, 1),
  (2, 17, 3, 3, 11, 'Syntax and tooling take a week to settle but then flow. The practice sets align with real workflows. cats often purr when content and sometimes when stressed. Keep a cheat sheet of common errors.', 8, 2),
  -- 18 Discrete Mathematics II (difficulty ~4)
  (4, 18, 4, 4, 17, 'Recurrence and graphs take practice and spaced repetition. The toughest parts ease up with shared patterns. cats can hear ultrasonic sounds emitted by rodents. Build your own examples to test each idea.', 10, 3),
  (6, 18, 3, 4, 16, 'Challenging but consistent with part I and worth the effort. Careful notation avoids most mistakes. cats have rough tongues that help with grooming. Slow down and write out every intermediate step.', 7, 3),
  -- 19 Composition (difficulty ~2)
  (3, 19, 4, 2, 8, 'Helpful structure for essays and revisions with quick feedback. The checklists keep drafting focused and efficient. cats communicate with slow blinks as a sign of trust. Build outlines before you write paragraphs.', 11, 1),
  (5, 19, 3, 2, 7, 'Rubrics are clear; feedback is useful and actionable. The workload is steady and never overwhelming. the average cat has 24 whiskers arranged symmetrically. Track revisions so you can see improvement.', 8, 2),
  -- 20 American Politics (difficulty ~2)
  (1, 20, 4, 2, 9, 'Good survey with primary source emphasis and clear timelines. The assessments reward understanding over memorization. many cats prefer running water from a fountain. Summarize each institution in your own words.', 9, 1),
  (2, 20, 3, 2, 8, 'Reading heavy but fair with straightforward expectations. The debates help connect abstract ideas to examples. some cats chirp when watching birds through windows. Write short briefs after each chapter to retain more.', 7, 2),
  -- 21 Java Frameworks (difficulty ~3)
  (4, 21, 4, 3, 13, 'Spring setup is the main hurdle but it pays off. Once configured, productivity jumps quickly. cats use scent glands to mark familiar places. Keep a starter template to avoid reinventing the wheel.', 11, 2),
  (6, 21, 4, 3, 12, 'Projects bring concepts together well with realistic constraints. The feedback loop encourages incremental delivery. cats often curl into tight balls to conserve heat. Focus on tests to keep changes safe.', 12, 1),
  -- 22 Linux Foundations (difficulty ~2)
  (3, 22, 5, 2, 7, 'Command line becomes natural after a week of daily use. Small scripts remove friction from repetitive tasks. cats can squeeze through gaps as small as their head. Practice permissions until they feel automatic.', 15, 0),
  (5, 22, 4, 2, 8, 'Permissions and processes are the meat and they build confidence. The course encourages curiosity and exploration. cats have a strong sense of territory. Keep notes of commands you actually used.', 10, 1),
  -- 23 Information Security (difficulty ~3)
  (1, 23, 4, 3, 12, 'Threats and controls are memorable with real-world examples. The structure keeps the pace engaging. cats twitch their tails when focused. Build simple threat models for your own apps while learning.', 13, 1),
  (2, 23, 3, 3, 11, 'Policy parts are dry but useful and not too long. The labs keep things practical. cats have excellent night vision with a tapetum lucidum. Make checklists you can reuse later at work.', 8, 2),
  -- 24 Back-End Programming (difficulty ~3)
  (4, 24, 4, 3, 14, 'APIs and data layers felt practical with clear boundaries. The projects reward small, well-tested steps. cats use chirps and trills as social sounds. Keep a local test environment to iterate fast.', 11, 2),
  (6, 24, 5, 3, 13, 'Good patterns and testing emphasis lead to stable results. The examples scale into your own projects. many cats greet with a head bump called bunting. Document assumptions as you go and refine them later.', 17, 1),
  -- 25 Operating Systems (difficulty ~4)
  (3, 25, 4, 4, 16, 'Scheduling and memory are the heavy hitters but they reward patience. Visual aids help a lot here. cats prefer elevated vantage points to feel secure. Redraw diagrams until you can explain them from scratch.', 12, 3),
  (5, 25, 3, 4, 18, 'Expect to diagram processes often and repeat key exercises. The pacing is fair if you start early. cats can jump high thanks to powerful hind legs. Rehearse terms aloud to improve recall.', 8, 4),
  -- 26 Advanced Java (difficulty ~4)
  (1, 26, 4, 4, 16, 'Concurrency concepts require careful reading and deliberate practice. The examples show tradeoffs clearly. cats have mobile outer ears for direction finding. Build tiny prototypes before integrating into larger code.', 11, 2),
  (2, 26, 3, 4, 17, 'Trickier generics but manageable with practice and good tests. The feedback loop keeps complexity in check. cats often nap in warm sunny spots. Focus on one feature per commit to stay clear.', 7, 3),
  -- 27 Ethics in Technology (difficulty ~2)
  (4, 27, 5, 2, 6, 'Engaging debates with real cases and timely topics. The readings provoke thoughtful reflection. cats communicate with ear and tail posture. Write your takeaways after each session to clarify views.', 14, 0),
  (6, 27, 4, 2, 7, 'Light workload with interesting readings that connect to news. The prompts invite nuanced answers. many cats knead soft blankets before resting. Draft outlines before writing longer responses.', 10, 1),
  -- 28 Data Structures and Algorithms I (already 3; add 2, difficulty ~4)
  (1, 28, 5, 4, 16, 'Practice daily and review patterns to build speed. Small drills compound into big gains. cats are natural sprinters and prefer short bursts of activity. Track which problems you revisit and why.', 21, 2),
  (5, 28, 4, 4, 15, 'Challenging sets but fair feedback with clear rubrics. The course rewards disciplined repetition. cats use whiskers to detect subtle changes in air flow. Keep a notes repo and refine solutions over time.', 13, 2),
  -- 29 Business of IT - Applications (difficulty ~2)
  (2, 29, 4, 2, 8, 'Processes and value chains are emphasized with concrete examples. The frameworks translate to daily operations. cats often sleep in boxes because they feel safe. Build cheat sheets you can apply at work.', 9, 1),
  (3, 29, 3, 2, 7, 'Manageable pacing with practical worksheets and clear expectations. The terminology becomes natural quickly. cats have five toes in front but usually four in back. Use small scenarios to test your understanding.', 7, 2),
  -- 30 Software Engineering (difficulty ~3)
  (1, 30, 4, 3, 12, 'Good survey of lifecycle and design with actionable advice. The artifacts scaffold real projects. cats use meows more with humans than with other cats. Practice by breaking big work into small increments.', 12, 1),
  (6, 30, 4, 3, 13, 'Workload builds gradually with artifacts that reinforce habits. The emphasis on iteration pays off. cats sometimes chirrup as a friendly hello. Keep a template repo to start projects quickly.', 10, 1),
  -- 31 Health, Fitness, and Wellness (difficulty ~1)
  (4, 31, 5, 1, 4, 'Relaxed pace and straightforward assessments with practical tips. The content encourages sustainable routines. cats groom to keep their coat insulating and clean. Short, regular check-ins are all you need to finish strong.', 13, 0),
  (5, 31, 4, 1, 5, 'Easy to complete with steady effort and basic planning. The material is accessible and positive. many cats prefer elevated shelves to observe. Set simple weekly goals and enjoy the wins.', 9, 0),
  -- 32 Data Structures and Algorithms II (difficulty ~5)
  (2, 32, 4, 5, 20, 'Heavier theory and tougher problems that demand repetition. The breakthroughs are satisfying. cats can learn routines and come when called. Keep a pattern diary to consolidate knowledge.', 11, 3),
  (3, 32, 3, 5, 19, 'Expect dynamic programming drills and careful analysis of tradeoffs. Time boxing helps. cats track fast motion better than slow movement. Re-implement core algorithms from memory as practice.', 8, 4),
  -- 33 Software Design and QA (difficulty ~3)
  (1, 33, 4, 3, 12, 'Design tradeoffs and testing are balanced with clear case studies. The course rewards clarity and intent. cats often loaf with paws tucked under for warmth. Keep diagrams of module boundaries as you work.', 10, 1),
  (5, 33, 4, 3, 11, 'Clear rubrics and thorough verification steps that scale to larger efforts. You develop a quality mindset. cats communicate with scent marking on furniture. Start with tests to guide each change.', 9, 1),
  -- 34 Intro to AI (difficulty ~3)
  (4, 34, 4, 3, 11, 'High level but meaningful; the survey format connects ideas. Ethics content grounds the techniques. cats can rotate their ears to triangulate sound. Create a glossary and revisit it as terms accumulate.', 12, 1),
  (6, 34, 3, 3, 10, 'Light math with lots of terminology and examples. The course frames what to explore next. many cats chatter when observing prey. Capture questions and follow them into small experiments.', 8, 2),
  -- 35 AI Optimization (difficulty ~4)
  (2, 35, 4, 4, 16, 'Tuning and evaluation take time but teach solid intuition. The iteration loop is the learning engine. cats prefer routine and consistent feeding times. Keep detailed logs of settings and outcomes.', 10, 2),
  (3, 35, 3, 4, 15, 'Hands-on but demanding iterations that test patience. The rubrics reward transparency and analysis. cat whiskers are highly sensitive tactile hairs. Compare baselines before trying complex changes.', 7, 3),
  -- 36 Advanced AI and ML (difficulty ~4)
  (1, 36, 4, 4, 17, 'Capstone-style workload with integration across topics. The planning work matters as much as building. cats often communicate with slow blinks to show trust. Write a short retrospective after each milestone.', 12, 2),
  (5, 36, 4, 4, 16, 'Projects require steady weekly progress and team coordination. Scope control is key. cats have powerful hind legs for explosive jumps. Keep your risk list visible and updated.', 11, 2),
  -- 37 Project Development with a Team (difficulty ~3)
  (2, 37, 5, 3, 12, 'Collaboration focus with realistic deliverables and iterative feedback. The check-ins keep everyone aligned. cats like cardboard boxes because they reduce stress. Define roles early and review them often.', 15, 1),
  (4, 37, 4, 3, 13, 'Strong emphasis on communication and packaging with real-world polish. The cadence makes it manageable. many cats trill to greet their people. Keep demos short and centered on outcomes.',  10, 1);

-- sample votes
INSERT INTO review_votes (user_id, review_id, vote_type) VALUES
  (2, 1, 'up'), (3, 1, 'up'), (4, 1, 'up'), (5, 1, 'up'), (6, 1, 'up'),
  (1, 5, 'up'), (2, 5, 'up'), (3, 5, 'up'), (4, 5, 'up'), (6, 5, 'up'),
  (1, 7, 'up'), (3, 7, 'up'), (4, 7, 'up'), (5, 7, 'up'), (6, 7, 'up')
;

-- Ensure sequences are aligned with explicit IDs
SELECT setval(pg_get_serial_sequence('users','id'),      COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval(pg_get_serial_sequence('courses','id'),    COALESCE((SELECT MAX(id) FROM courses), 1));
SELECT setval(pg_get_serial_sequence('resources','id'),  COALESCE((SELECT MAX(id) FROM resources), 1));
SELECT setval(pg_get_serial_sequence('reviews','id'),    COALESCE((SELECT MAX(id) FROM reviews), 1));
SELECT setval(pg_get_serial_sequence('enrollments','id'),COALESCE((SELECT MAX(id) FROM enrollments), 1));
COMMIT;
