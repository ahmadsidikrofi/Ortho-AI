import { Chroma } from "@langchain/community/vectorstores/chroma";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import fs from "fs";

// Path ke ChromaDB lokal
const CHROMA_DB_URL = "http://localhost:8000"; // Pastikan ChromaDB berjalan di port ini

// Load QA data
const jsonData = JSON.parse(fs.readFileSync("c:/Users/acer/Downloads/cleaned_doctor_QA.json", "utf-8"));

// Konversi data ke format LangChain
const docs = jsonData.map((item) => ({
  pageContent: `Q: ${item.question}\nA: ${item.answer}`,
  metadata: { source: "doctor_qa" },
}));

async function storeEmbeddings() {
  const vectorStore = await Chroma.fromDocuments(
    docs,
    new GoogleGenerativeAIEmbeddings(),
    {
      collectionName: "doctor_qa",
      url: CHROMA_DB_URL, // Hubungkan ke ChromaDB lokal
    }
  );
  console.log("✅ Embeddings stored successfully!");
}

storeEmbeddings();