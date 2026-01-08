const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Vacancy App API",
    version: "1.0.0",
    description: "API для кіравання вакансіямі і шаблонамі",
  },
  servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
  components: {
    schemas: {
      Template: {
        type: "object",
        required: ["agencyName", "templateName"],
        properties: {
          agencyName: { type: "string", example: "Morliny" },
          templateName: { type: "string", example: "Lisner_Fish" },
          keywords: {
            type: "array",
            items: { type: "string" },
            example: ["Lisner", "Ліснер"],
          },
          title: { type: "string", example: "Упакоўка рыбы" },
          location: { type: "string", example: "Kołobrzeg" },
          description: { type: "string" },
          salaryDetails: { type: "string" },
          accommodationDetails: { type: "string" },
        },
      },
      Vacancy: {
        type: "object",
        required: ["title", "location"],
        properties: {
          title: { type: "string" },
          location: { type: "string" },
          agencyName: { type: "string" },
          description: { type: "string" },
          rawText: { type: "string" },
          status: { type: "string", enum: ["active", "expired"] },
        },
      },
    },
  },
  paths: {
    "/api/vacancies": {
      get: {
        tags: ["Vacancies"],
        summary: "Атрымаць усе актуальныя вакансіі",
        responses: { 200: { description: "OK" } },
      },
      post: {
        tags: ["Vacancies"],
        summary: "Стварыць вакансію",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Vacancy" },
            },
          },
        },
        responses: { 201: { description: "Created" } },
      },
    },
    "/api/vacancies/{id}": {
      put: {
        tags: ["Vacancies"],
        summary: "Абнавіць вакансію",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Vacancy" },
            },
          },
        },
        responses: { 200: { description: "Updated" } },
      },
      delete: {
        tags: ["Vacancies"],
        summary: "Выдаліць вакансію",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "Deleted" } },
      },
    },
    "/api/templates": {
      get: {
        tags: ["Templates"],
        summary: "Атрымаць усе шаблоны",
        responses: { 200: { description: "OK" } },
      },
      post: {
        tags: ["Templates"],
        summary: "Стварыць новы шаблон",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Template" },
            },
          },
        },
        responses: { 201: { description: "Created" } },
      },
    },
    "/api/templates/{id}": {
      put: {
        tags: ["Templates"],
        summary: "Абнавіць шаблон",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Template" },
            },
          },
        },
        responses: { 200: { description: "Updated" } },
      },
      delete: {
        tags: ["Templates"],
        summary: "Выдаліць шаблон",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { 200: { description: "Deleted" } },
      },
    },
  },
};

module.exports = swaggerDefinition;
