// scripts/exportDataSingleStream.ts
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function exportDataSingleStream() {
  let writeStream: fs.WriteStream | null = null;
  
  try {
    console.log("Début de l'export des données (version stream)...");

    const exportDir = `./scripts/export_${new Date().toISOString().split('T')[0]}`;
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const filePath = path.join(exportDir, "complete_export_stream.json");
    writeStream = fs.createWriteStream(filePath, { encoding: 'utf8' });

    // Début du JSON
    writeStream.write('{\n');
    writeStream.write('  "metadata": ' + JSON.stringify({
      exportDate: new Date().toISOString(),
      version: "1.0",
      source: "Prisma Database"
    }, null, 2) + ',\n');

    // Fonction pour écrire chaque modèle
    const writeModel = async (key: string, dataPromise: Promise<any>) => {
      const data = await dataPromise;
      writeStream!.write(`  "${key}": ` + JSON.stringify(data, null, 2));
      console.log(`✅ ${key}: ${data.length} enregistrement(s)`);
      return data.length;
    };

    // Export séquentiel pour éviter la surcharge mémoire
    const models = {
      circuits: prisma.circuit.findMany({ include: { itineraries: true, circuitRequest: true, reservations: true, highlights: true, included: true, notIncluded: true } }),
      tripTravels: prisma.tripTravel.findMany({ include: { program: true, travelDates: true, reservations: true, highlights: true, included: true, notIncluded: true } }),
      users: prisma.user.findMany({ include: { reviews: true, comments: true } }),
      vehicles: prisma.vehicle.findMany({ include: { reservations: true, categoryRel: true } }),
      categories: prisma.category.findMany({ include: { vehicles: true } }),
      blogs: prisma.blog.findMany({ include: { articles: { include: { comments: true } }, comments: true } }),
      articles: prisma.article.findMany({ include: { comments: true, blog: true } }),
      reviews: prisma.review.findMany({ include: { user: true } }),
      comments: prisma.comment.findMany({ include: { user: true, blog: true, article: true, replies: true, parent: true } }),
      itineraries: prisma.itinerary.findMany({ include: { circuit: true } }),
      programs: prisma.program.findMany({ include: { tripTravel: true } }),
      travelDates: prisma.travelDates.findMany({ include: { tripTravel: true, reservations: true } }),
      highlights: prisma.highlight.findMany({ include: { circuit: true, TripTravel: true } }),
      included: prisma.included.findMany({ include: { circuit: true, tripTravel: true } }),
      notIncluded: prisma.notIncluded.findMany({ include: { circuit: true, TripTravel: true } }),
      reservations: prisma.reservation.findMany({ include: { circuitRel: true, vehicleRel: true, TripTravel: true, travelDate: true } }),
      circuitRequests: prisma.circuitRequest.findMany({ include: { circuitRel: true } }),
      partenariatRequests: prisma.partenariatRequest.findMany(),
      autreRequests: prisma.autreRequest.findMany(),
    };

    const modelKeys = Object.keys(models);
    let totalRecords = 0;
    const counts: Record<string, number> = {};

    for (let i = 0; i < modelKeys.length; i++) {
      const key = modelKeys[i];
      const count = await writeModel(key, models[key as keyof typeof models]);
      counts[key] = count;
      totalRecords += count;

      // Ajouter une virgule sauf pour le dernier élément
      if (i < modelKeys.length - 1) {
        writeStream.write(',\n');
      } else {
        writeStream.write('\n');
      }
    }

    // Fin du JSON
    writeStream.write('}');
    writeStream.end();

    console.log(`\n🎉 Export unique terminé avec succès !`);
    console.log(`📁 Fichier: ${filePath}`);
    console.log(`📊 Total de tous les enregistrements: ${totalRecords}`);
    
    console.log("\n📈 Détail par modèle:");
    Object.entries(counts).forEach(([model, count]) => {
      console.log(`   📦 ${model}: ${count} enregistrement(s)`);
    });

  } catch (error) {
    console.error("❌ Erreur lors de l'export:", error);
    throw error;
  } finally {
    if (writeStream) {
      writeStream.end();
    }
  }
}

// Exécution du script stream
exportDataSingleStream()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });