// data_application.js
// Application page type data

export const application_page_data = {
  header: {
    data: {},
    children: [
      { type: "h1", data: { content: "Project Manager" } },
      {
        type: "nav",
        data: {},
        children: [
          {
            type: "menu",
            data: {},
            children: [
              { type: "li", data: {}, children: [{ type: "a", data: { href: "#", content: "Dashboard" } }] },
              { type: "li", data: {}, children: [{ type: "a", data: { href: "#", content: "Projects" } }] },
              { type: "li", data: {}, children: [{ type: "a", data: { href: "#", content: "Tasks" } }] },
              { type: "li", data: {}, children: [{ type: "a", data: { href: "#", content: "Team" } }] }
            ]
          }
        ]
      },
      { type: "button", data: { content: "New Project" } }
    ]
  },
  main: {
    aside: {
      data: {},
      children: [
        {
          type: "section",
          data: {},
          children: [
            { type: "h2", data: { content: "Projects" } },
            {
              type: "nav",
              data: {},
              children: [
                { type: "a", data: { href: "#", content: "Website Redesign" } },
                { type: "a", data: { href: "#", content: "Mobile App" } },
                { type: "a", data: { href: "#", content: "API Integration" } }
              ]
            }
          ]
        },
        {
          type: "section",
          data: {},
          children: [
            { type: "h2", data: { content: "Quick Actions" } },
            {
              type: "nav",
              data: {},
              children: [
                { type: "a", data: { href: "#", content: "New Task" } },
                { type: "a", data: { href: "#", content: "Schedule" } }
              ]
            }
          ]
        }
      ]
    },
    article: {
      data: {},
      children: [
        {
          type: "header",
          data: {},
          children: [
            {
              type: "nav",
              data: {},
              children: [
                {
                  type: "menu",
                  data: {},
                  children: [
                    { type: "li", data: { "aria-current": "page" }, children: [{ type: "a", data: { href: "#", content: "Dashboard" } }] },
                    { type: "li", data: {}, children: [{ type: "a", data: { href: "#", content: "Tasks" } }] }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: "section",
          data: {},
          children: [
            {
              type: "section",
              data: {},
              children: [
                { type: "h1", data: { content: "Project Dashboard" } },
                { type: "p", data: { content: "Overview of all projects and tasks." } }
              ]
            },
            {
              type: "section",
              data: {},
              children: [
                { type: "h2", data: { content: "Active Projects" } },
                {
                  type: "ul",
                  data: {},
                  children: [
                    { type: "li", data: {}, content: "Website Redesign - 75% complete" },
                    { type: "li", data: {}, content: "Mobile App - 40% complete" },
                    { type: "li", data: {}, content: "API Integration - 90% complete" }
                  ]
                }
              ]
            },
            {
              type: "section",
              data: {},
              children: [
                { type: "h2", data: { content: "Recent Tasks" } },
                {
                  type: "ul",
                  data: {},
                  children: [
                    { type: "li", data: {}, content: "Review design mockups" },
                    { type: "li", data: {}, content: "Update project timeline" }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: "footer",
          data: {},
          children: [
            { type: "p", data: { content: "Project Manager v2.1.0" } }
          ]
        }
      ]
    }
  },
  footer: {
    data: {},
    children: [
      { type: "p", data: { content: "Project Manager Application" } },
      {
        type: "nav",
        data: {},
        children: [
          { type: "a", data: { href: "#", content: "Help" } },
          { type: "a", data: { href: "#", content: "Support" } }
        ]
      }
    ]
  }
};
