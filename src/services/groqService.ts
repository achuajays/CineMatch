import { Groq } from "groq-sdk";
import { z } from "zod";
import { getSavedMovies } from './storageService';
import { getWatchedMovies } from './watchedMoviesService';
import { getDislikedMovies } from './dislikedMoviesService';

// Get API key from localStorage
const getApiKey = () => {
  return localStorage.getItem('groq_api_key');
};

// Create client with API key from localStorage
const createClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('No API key found. Please configure your Groq API key.');
  }
  
  return new Groq({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

// Define a schema with Zod for movie recommendations
const MovieSchema = z.object({
  name: z.string(),
  smallDescription: z.string(),
  genre: z.string(),
  bigDescription: z.string(),
  synopsis: z.string(),
});

const MoviesResponseSchema = z.object({
  movies: z.array(MovieSchema).length(5)
});

// Get list of movies to avoid (watched + saved)
const getMoviesToAvoid = (): string[] => {
  const savedMovies = getSavedMovies();
  const watchedMovies = getWatchedMovies();
  const dislikedMovies = getDislikedMovies();
  
  const moviesToAvoid = [
    ...savedMovies.map(movie => movie.name),
    ...watchedMovies.map(movie => movie.name),
    ...dislikedMovies.map(movie => movie.name)
  ];
  
  // Remove duplicates
  return [...new Set(moviesToAvoid)];
};

// Create a prompt that clearly defines the expected structure
const createSystemPrompt = (moviesToAvoid: string[]) => `
You are a movie recommendation expert. When asked about movies, 
always respond with valid JSON objects that match this structure:
{
  "movies": [
    {
      "name": "Movie Title",
      "smallDescription": "Brief one-line description (max 60 characters)",
      "genre": "Primary Genre",
      "bigDescription": "Detailed description (2-3 sentences about plot and style)",
      "synopsis": "Complete plot synopsis (4-5 sentences with key story elements)"
    }
  ]
}

Based on the user's input, recommend exactly 5 movies that match their vibe or request.
Make sure to:
- Include a mix of popular and lesser-known films
- Match the mood, genre, or theme requested
- Provide accurate information about real movies
- Keep descriptions engaging and informative

${moviesToAvoid.length > 0 ? `
IMPORTANT: Do NOT recommend any of these movies as the user has already watched or saved them:
${moviesToAvoid.map(movie => `- ${movie}`).join('\n')}

Please suggest different movies that match the user's request but are NOT in the above list.
` : ''}

Your response should ONLY contain the JSON object and nothing else.
`;

export async function getMovieRecommendations(userInput: string): Promise<any[]> {
  try {
    const client = createClient();
    const moviesToAvoid = getMoviesToAvoid();
    const systemPrompt = createSystemPrompt(moviesToAvoid);
    
    // Request structured data from the model
    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput },
      ],
      temperature: 0.7,
      max_tokens: 8000,
    });

    // Extract the response
    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error('No response from Groq');
    }

    // Parse and validate JSON
    const jsonData = JSON.parse(responseContent);
    const validatedData = MoviesResponseSchema.parse(jsonData);
    
    return validatedData.movies;
  } catch (error) {
    console.error('Error getting movie recommendations:', error);
    
    if (error instanceof z.ZodError) {
      console.error("Schema validation failed:", error.errors);
    } else if (error instanceof SyntaxError) {
      console.error("JSON parsing failed: The model did not return valid JSON");
    }
    
    // Return fallback recommendations
    return [
      {
        name: "The Shawshank Redemption",
        smallDescription: "Hope and friendship behind prison walls",
        genre: "Drama",
        bigDescription: "A banker wrongly convicted of murder finds hope and redemption through friendship with a fellow inmate in this timeless tale of human resilience.",
        synopsis: "Andy Dufresne is sentenced to life in Shawshank State Penitentiary for the murders of his wife and her lover, despite maintaining his innocence. Over the years, he befriends fellow inmate Ellis 'Red' Redding and becomes instrumental in money laundering operations. Andy's quiet strength and unwavering hope inspire his fellow inmates, and he slowly earns the respect of inmates and guards alike. His friendship with Red deepens over the decades, and Andy's determination to maintain his dignity and hope ultimately leads to an extraordinary conclusion."
      },
      {
        name: "Inception",
        smallDescription: "Dreams within dreams in a mind-bending heist",
        genre: "Sci-Fi",
        bigDescription: "A thief who enters people's dreams to steal secrets is given the inverse task of planting an idea in this complex, layered thriller.",
        synopsis: "Dom Cobb is a skilled thief who specializes in extraction - entering people's dreams to steal their deepest secrets. His rare ability has made him a coveted player in corporate espionage but has also cost him everything he loves. Cobb gets a chance at redemption when he's offered an impossible task: inception, planting an idea rather than stealing one. If successful, it could be the perfect crime, but a dangerous enemy anticipates their every move. The team must navigate multiple layers of dreams, where reality becomes increasingly uncertain."
      },
      {
        name: "Parasite",
        smallDescription: "Dark comedy about class warfare and deception",
        genre: "Thriller",
        bigDescription: "A poor family schemes to infiltrate a wealthy household, leading to unexpected consequences in this Oscar-winning masterpiece.",
        synopsis: "The Kim family lives in a semi-basement apartment, struggling to make ends meet. When the son Ki-woo gets an opportunity to tutor the daughter of the wealthy Park family, he sees a chance for the entire family to escape poverty. One by one, the Kims infiltrate the Park household by posing as unrelated, highly qualified workers. However, their carefully constructed deception begins to unravel when they discover the house's previous housekeeper has been hiding a dark secret in the basement. What starts as a darkly comic tale of class aspiration escalates into a shocking thriller about inequality and desperation."
      },
      {
        name: "Mad Max: Fury Road",
        smallDescription: "High-octane chase through post-apocalyptic wasteland",
        genre: "Action",
        bigDescription: "In a post-apocalyptic world, a woman rebels against a tyrannical ruler in search of her homeland with the aid of a group of female prisoners.",
        synopsis: "In a stark desert landscape where humanity is broken, two rebels on the run might be able to restore order. Max Rockatansky, a man of action and few words, seeks peace of mind following the loss of his wife and child. Imperator Furiosa, a woman of action, is trying to make it back to her childhood homeland. She's stolen the Five Wives from the Citadel of the warlord Immortan Joe, who rules the wasteland through control of water. Joe sends his army in pursuit, leading to an extended chase across the desert in heavily armed vehicles."
      },
      {
        name: "Spirited Away",
        smallDescription: "Magical adventure in a world of spirits and wonder",
        genre: "Animation",
        bigDescription: "A young girl enters a magical world ruled by spirits and witches, where she must work to save her parents and find her way home.",
        synopsis: "Ten-year-old Chihiro and her parents stumble upon a seemingly abandoned amusement park while moving to their new home. After her parents are transformed into pigs by the witch Yubaba, Chihiro must work at Yubaba's bathhouse for spirits to free them and find a way back to the human world. With the help of the mysterious Haku and other spirits she befriends, Chihiro learns about courage, friendship, and identity. She must navigate the complex rules of the spirit world while maintaining her humanity and discovering her own inner strength."
      }
    ];
  }
}