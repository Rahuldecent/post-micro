import prisma from "../config/db.config.js"
import axios from "axios"
class PostController {

  static async index(req, res) {
    try {
      const posts = await prisma.post.findMany({});
      // Approach 1
      // let postWithUsers = await Promise.all(
      //   posts.map(async (post) => {
      //     const res = await axios.get(
      //       `${process.env.AUTH_MICRO_URL}/api/getUser/${post.user_id}`
      //     );
      //     console.log("the user res", res.data);
      //     return {
      //       ...post,
      //       ...res.data,
      //     };
      //   })
      // );


      // approach 2

      let userIds = []
      posts.forEach((post) =>{
        userIds.push(post.user_id)
      });
     const response = await axios.post(`${process.env.AUTH_MICRO_URL}/api/getUsers`,userIds)
     const users = {};
     response.data.users.forEach((item) => {
      users[item.id] = item;
    });
    console.log(users,"✌️✌️✌️✌️✌️✌️✌️✌️")
    //  let postWithUsers = await Promise.all(
    //       posts.map((post) => {
    //         const user = response.data.users.find((item) => item.id === post.user_id);
    //         return {
    //           ...post,
    //           user,
    //         };
    //       })
    //     );


    // method 3
    let postWithUsers = await Promise.all(
      posts.map((post) =>{
        const user = users[post.user_id]
        return {
          ...post,
          user
        }
      })
    )
      return res.status(200).send({ postWithUsers })
    } catch (error) {
      return res.status(500).json({ message: "Soemthing went wrong", error: error })
    }
  }


  static async store(req, res) {
    try {
      const authUser = req.user;
      const { title, content } = req.body;
      const post = await prisma.post.create({
        data: {
          user_id: authUser.id,
          title,
          content,
        },
      });

      return res.json({ message: "Post created successfully!", post });
    } catch (error) {
      console.log(error, "🦞🦞🦞🦞🦞🦞🦞🦞")
      return res.status(500).json({ message: "Something went wrong." });
    }
  }
}

export default PostController;