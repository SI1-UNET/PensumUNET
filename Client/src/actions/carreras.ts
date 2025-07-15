import { defineAction } from 'astro:actions';
import { z } from 'astro:content';
import { getSecret } from 'astro:env/server';
import { de } from 'zod/v4/locales';
import type { ICarrera } from '../schemas/carreras';

const SERVER_ADDRESS = getSecret("SERVER_ADDRESS")

export const carreras = {
    get: defineAction({
        handler: async (input,context) => {
            try {
              const res = await fetch(`http://${SERVER_ADDRESS}/courses/all`,{
                  method: "GET",
                  headers: context.request.headers
              });

              if (!res.ok) {
                  throw new Error(`Error fetching carreras: ${res.statusText}`);
              }
              return res.json();
            
          } catch (error) {
              throw new Error(`Error fetching carreras: ${error}`);
          }
        }
    }),
}