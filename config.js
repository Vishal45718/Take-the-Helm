const DASHBOARD_CONFIG = {
    categories: [
        {
            id: "work",
            title: "Work",
            links: [
                {
                    name: "Gmail",
                    url: "https://mail.google.com",
                    icon: "https://www.google.com/s2/favicons?domain=mail.google.com&sz=64",
                    target: "_blank",
                    rel: "noopener"
                },
                {
                    name: "GitHub",
                    url: "https://github.com",
                    icon: "https://www.google.com/s2/favicons?domain=github.com&sz=64",
                    target: "_blank",
                    rel: "noopener"
                },
                {
                    name: "LinkedIn",
                    url: "https://www.linkedin.com",
                    icon: "https://www.google.com/s2/favicons?domain=linkedin.com&sz=64",
                    target: "_blank",
                    rel: "noopener"
                }
            ]
        },
        {
            id: "ai",
            title: "AI",
            links: [
                {
                    name: "ChatGPT",
                    url: "https://chatgpt.com",
                    icon: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=64",
                    target: "_blank",
                    rel: "noopener"
                },
                {
                    name: "DeepSeek",
                    url: "https://chat.deepseek.com",
                    icon: "https://www.google.com/s2/favicons?domain=deepseek.com&sz=64",
                    target: "_blank",
                    rel: "noopener"
                },
                {
                    name: "Gemini",
                    url: "https://gemini.google.com",
                    icon: "https://www.google.com/s2/favicons?domain=gemini.google.com&sz=64",
                    target: "_blank",
                    rel: "noopener"
                },
                {
                    name: "Claude",
                    url: "https://claude.ai",
                    icon: "https://www.google.com/s2/favicons?domain=claude.ai&sz=64",
                    target: "_blank",
                    rel: "noopener"
                },
                {
                    name: "Perplexity",
                    url: "https://www.perplexity.ai",
                    icon: "https://www.google.com/s2/favicons?domain=perplexity.ai&sz=64",
                    target: "_blank",
                    rel: "noopener"
                }
            ]
        },
        {
            id: "entertainment",
            title: "Entertainment",
            links: [
                {
                    name: "Spotify",
                    url: "https://open.spotify.com",
                    icon: "https://www.google.com/s2/favicons?domain=spotify.com&sz=64",
                    target: "_blank",
                    rel: "noopener"
                },
                {
                    name: "YouTube",
                    url: "https://www.youtube.com",
                    icon: "https://www.google.com/s2/favicons?domain=youtube.com&sz=64",
                    target: "_blank",
                    rel: "noopener"
                },
                {
                    name: "YouTube Music",
                    url: "https://music.youtube.com",
                    icon: "https://www.google.com/s2/favicons?domain=music.youtube.com&sz=64",
                    target: "_blank",
                    rel: "noopener"
                },
                {
                    name: "Hotstar",
                    url: "https://www.hotstar.com/in/home",
                    icon: "https://www.google.com/s2/favicons?domain=hotstar.com&sz=64",
                    target: "_blank",
                    rel: "noopener"
                }
            ]
        },
        {
            id: "learn",
            title: "Learn",
            links: [
                {
                    name: "LeetCode",
                    url: "https://leetcode.com",
                    icon: "https://www.google.com/s2/favicons?domain=leetcode.com&sz=64",
                    target: "_blank",
                    rel: "noopener"
                },
                {
                    name: "Codeforces",
                    url: "https://codeforces.com",
                    icon: "https://www.google.com/s2/favicons?domain=codeforces.com&sz=64",
                    target: "_blank",
                    rel: "noopener"
                },
                {
                    name: "Stack Overflow",
                    url: "https://stackoverflow.com",
                    icon: "https://www.google.com/s2/favicons?domain=stackoverflow.com&sz=64",
                    target: "_blank",
                    rel: "noopener"
                },
                {
                    name: "Codédex",
                    url: "https://www.codedex.io",
                    icon: "https://www.google.com/s2/favicons?domain=codedex.io&sz=64",
                    target: "_blank",
                    rel: "noopener"
                },
                {
                    name: "Codewars",
                    url: "https://www.codewars.com",
                    icon: "https://www.google.com/s2/favicons?domain=codewars.com&sz=64",
                    target: "_blank",
                    rel: "noopener"
                }
            ]
        },
        {
            id: "social",
            title: "Social",
            links: [
                {
                    name: "Instagram",
                    url: "https://www.instagram.com",
                    icon: "https://www.google.com/s2/favicons?domain=instagram.com&sz=64",
                    target: "_blank",
                    rel: "noopener"
                },
                {
                    name: "X",
                    url: "https://x.com",
                    icon: "https://www.google.com/s2/favicons?domain=x.com&sz=64",
                    target: "_blank",
                    rel: "noopener"
                },
                {
                    name: "Reddit",
                    url: "https://www.reddit.com",
                    icon: "https://www.google.com/s2/favicons?domain=reddit.com&sz=64",
                    target: "_blank",
                    rel: "noopener"
                }
            ]
        }
    ],
    projects: [
        {
            title: "TrainPulse",
            description: "Distributed LLM training monitoring, anomaly detection and fault localization."
        },
        {
            title: "Self-Healing RAG",
            description: "Multi-agent orchestration, tool use, persistent memory and human escalation."
        },
        {
            title: "Recommendation System",
            description: "FastAPI, PostgreSQL, Redis, Kafka and FAISS based recommendation platform."
        },
        {
            title: "AETHER",
            description: "Personal web project and landing page workspace."
        }
    ]
};

function validateDashboardConfig(config) {
    const errors = [];

    if (!config || typeof config !== "object") {
        errors.push("DASHBOARD_CONFIG must be a non-null object.");
        return { valid: false, errors };
    }

    if (!Array.isArray(config.categories)) {
        errors.push("DASHBOARD_CONFIG.categories must be an array.");
    } else {
        const categoryIds = new Set();
        config.categories.forEach((category, catIdx) => {
            const catPrefix = `Category[${catIdx}]`;
            if (!category || typeof category !== "object") {
                errors.push(`${catPrefix} must be an object.`);
                return;
            }

            if (typeof category.id !== "string" || !category.id.trim()) {
                errors.push(`${catPrefix} is missing a valid 'id' string.`);
            } else if (categoryIds.has(category.id)) {
                errors.push(`${catPrefix} has duplicate id '${category.id}'.`);
            } else {
                categoryIds.add(category.id);
            }

            if (typeof category.title !== "string" || !category.title.trim()) {
                errors.push(`${catPrefix} (id: '${category.id || "unknown"}') is missing a valid 'title' string.`);
            }

            if (!Array.isArray(category.links)) {
                errors.push(`${catPrefix} (id: '${category.id || "unknown"}') 'links' must be an array.`);
            } else {
                category.links.forEach((link, linkIdx) => {
                    const linkPrefix = `${catPrefix}.links[${linkIdx}]`;
                    if (!link || typeof link !== "object") {
                        errors.push(`${linkPrefix} must be an object.`);
                        return;
                    }

                    if (typeof link.name !== "string" || !link.name.trim()) {
                        errors.push(`${linkPrefix} is missing a valid 'name' string.`);
                    }

                    if (typeof link.url !== "string" || !link.url.trim()) {
                        errors.push(`${linkPrefix} (name: '${link.name || "unknown"}') is missing a valid 'url' string.`);
                    } else {
                        try {
                            const parsed = new URL(link.url);
                            if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
                                errors.push(`${linkPrefix} URL '${link.url}' must use http or https protocol.`);
                            }
                        } catch {
                            errors.push(`${linkPrefix} has invalid URL format: '${link.url}'.`);
                        }
                    }
                });
            }
        });
    }

    if (config.projects !== undefined) {
        if (!Array.isArray(config.projects)) {
            errors.push("DASHBOARD_CONFIG.projects must be an array if provided.");
        } else {
            config.projects.forEach((project, projIdx) => {
                const projPrefix = `Project[${projIdx}]`;
                if (!project || typeof project !== "object") {
                    errors.push(`${projPrefix} must be an object.`);
                    return;
                }

                if (typeof project.title !== "string" || !project.title.trim()) {
                    errors.push(`${projPrefix} is missing a required 'title' string.`);
                }

                if (typeof project.description !== "string" || !project.description.trim()) {
                    errors.push(`${projPrefix} (title: '${project.title || "unknown"}') is missing a required 'description' string.`);
                }
            });
        }
    }

    if (errors.length > 0) {
        console.error("DASHBOARD_CONFIG validation found " + errors.length + " error(s):", errors);
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

if (typeof window !== "undefined") {
    window.DASHBOARD_CONFIG = DASHBOARD_CONFIG;
    window.validateDashboardConfig = validateDashboardConfig;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        DASHBOARD_CONFIG,
        validateDashboardConfig
    };
}
