import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";


interface GreetArgs{
    name: string;
}

const server = new Server(
    {
        name: "mcp-greet",
        version: "0.1.0",
        description: "A simple greeting server"
    },
    {
        capabilities:{
            tools:{

            }
        }
    }

) 

server.setRequestHandler(ListToolsRequestSchema, async () =>{
    return {
        tools: [
            {
                name: "greet",
                description: "Greet a person",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "The name of the person to greet"
                        }
                    },
                    required: ["name"]
                }

            }
        ]
    }
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const {name, arguments: args } = request.params;

    if(name==="greet"){
        const { name: personName } = args as unknown as GreetArgs;
        return {
            content: [
                {
                    type: "text",
                    text: `Hola, ${personName}"! Que fuerte que sos manín`
                }
            ]
        }
    }

    throw new Error(`Tool ${name} not found`)

});

async function main(): Promise<void> {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((error) => {
    console.error("Error arrancando el servidor:", error);
    process.exit(1);
});