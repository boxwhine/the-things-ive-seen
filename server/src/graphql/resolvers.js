// const resolvers = {
//   Mutation: {
//     createPost: async (parent, { title, desc, author }, { models }) => {
//       const Post = await models.Post.findOne({ title });

//       if (Post) {
//         throw new Error('Please provide a unique title.');        
//       }
      
//       // create a new post
//       const newPost = new models.Post({
//         title,
//         desc,
//         author
//       });

//       // save the post
//       try {
//         await newPost.save();
//       } catch (e) {
//         throw new Error('Cannot Save Post!!!');
//       }

//       return true;
//     },
//   },
// };

const resolvers = {
  Query: {
    events: async (parent, args, { models }) => {
      const events = await models.Event
        .find({})
        .populate('venue');
      return events;
    },
    venues: async (parent, args, { models }) => {
      const venues = await models.Venue.find({});
      return venues;
    },
  },
};

module.exports = resolvers;