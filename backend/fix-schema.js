const fs = require('fs');
const lines = fs.readFileSync('C:/Users/Techalphonic/stayr/backend/prisma/schema.prisma', 'utf8').split('\n');
const cleanLines = lines.slice(0, 265);

const newModels = `
enum CmsPageStatus {
  Draft
  Published
}

model CmsPage {
  id              String        @id @default(uuid())
  title           String
  slug            String        @unique
  pageType        String        @default("standard")
  content         String        @db.LongText
  seoTitle        String?
  seoDescription  String?       @db.Text
  seoKeywords     String?
  status          CmsPageStatus @default(Draft)
  isPublished     Boolean       @default(false)
  featuredImage   String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  deletedAt       DateTime?
  createdBy       String?
  updatedBy       String?
}

model FooterSetting {
  id              String   @id @default(uuid())
  companyLogo     String?
  itsLogo         String?
  currencyLogo    String?
  copyright       String?
  updatedAt       DateTime @updatedAt
}

model FooterColumn {
  id        String       @id @default(uuid())
  title     String
  sortOrder Int          @default(0)
  links     FooterLink[]
}

model FooterLink {
  id          String       @id @default(uuid())
  columnId    String
  title       String
  url         String
  icon        String?
  target      String       @default("_self")
  sortOrder   Int          @default(0)
  isActive    Boolean      @default(true)
  
  column      FooterColumn @relation(fields: [columnId], references: [id], onDelete: Cascade)
}
`;

fs.writeFileSync('C:/Users/Techalphonic/stayr/backend/prisma/schema.prisma', cleanLines.join('\n') + '\n' + newModels);
console.log('Schema fixed');
