import { Injectable, Logger } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';
import * as fs from 'fs';
import * as path from 'path';
const pdf = require('pdf-parse');

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);
  private readonly skillsList = [
    'Node.js', 'NestJS', 'MongoDB', 'React', 'Angular', 'Vue.js',
    'TypeScript', 'JavaScript', 'Python', 'Java', 'C#', 'C++',
    'AWS', 'Azure', 'Docker', 'Kubernetes', 'SQL', 'NoSQL',
    'Git', 'CI/CD', 'Rest API', 'GraphQL'
  ];

  async extractText(filePath: string, mimeType: string): Promise<string> {
    try {
      if (mimeType === 'application/pdf') {
        return this.extractFromPdf(filePath);
      } else if (mimeType.startsWith('image/')) {
        return this.extractFromImage(filePath);
      } else {
        this.logger.warn(`Unsupported mime type for OCR: ${mimeType}`);
        return '';
      }
    } catch (error) {
      this.logger.error(`Failed to extract text from ${filePath}`, error);
      return '';
    }
  }

  private async extractFromImage(filePath: string): Promise<string> {
    const result = await Tesseract.recognize(filePath, 'eng');
    return result.data.text;
  }

  private async extractFromPdf(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  extractSkills(text: string): string[] {
    const foundSkills = new Set<string>();
    const lowerText = text.toLowerCase();

    this.skillsList.forEach(skill => {
      if (lowerText.includes(skill.toLowerCase())) {
        foundSkills.add(skill);
      }
    });

    return Array.from(foundSkills);
  }
}
