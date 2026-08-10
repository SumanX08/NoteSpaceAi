import { Firecrawl } from "firecrawl";
import dotenv from 'dotenv';

dotenv.config();


const firecrawl = new Firecrawl({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export default firecrawl;