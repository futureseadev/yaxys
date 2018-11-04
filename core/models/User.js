module.exports = {
  schema: {
    title: "User",
    defaultProperties: ["id", "name"],
    properties: {
      id: {
        type: "integer",
      },
      name: {
        title: "Name",
        type: "string",
      },
      profiles: {
        title: "User profiles",
        type: "array",
        virtual: true,
        connection: {
          type: "m:m",
          linkerModel: "UserProfileBinding",
          linkerMyAttribute: "user",
          linkerRelatedAttribute: "userProfile",
        },
      },
      hasCustomRights: {
        title: "Has custom rights",
        readOnly: true,
        type: "boolean",
      },
    },
    required: ["name"],
  },

  api: RestService.buildStandardAPI("user"),
}