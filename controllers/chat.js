import { config } from "../config/config.js";
import mysql from "mysql2"

export const getChats = async (req, res) => {
    const pool = mysql.createConnection(config);
    const connection = pool.promise();
  
    try {
      const [rows] = await connection.execute(
        "SELECT * FROM chats",
      );

      res.status(200).json({result: rows})
  
    } catch (error) {
      console.log(error);
      res.status(500).json("Something went wrong...");
    } finally {
      connection.end();
    }
  };