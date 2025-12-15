export interface StorageItem {
  title: string
  downloadUrl: string
  category: string
  subcategory?: string
}

export const items: StorageItem[] = [
  // Games Category
 { 
    title: "Personal Information",
    downloadUrl:"https://1024terabox.com/s/1nmWjYxJEduIjQ3SpF3QGog",
    category: "Program",
    subcategory: "Q Basic"
  }, 

 { 
    title: "HI",
    downloadUrl:"https://1024terabox.com/s/1zxcgaumrBZN5NuyryWsDdA",
    category: "Program",
    subcategory: "Q Basic"
  }, 

 { 
    title: "Calculator",
    downloadUrl:"https://1024terabox.com/s/1afVAXrq3ofLbzoEsn8RPHQ",
    category: "Program",
    subcategory: "Q Basic"
  }, 

  { 
    title: "Html translator",
    downloadUrl:"https://1024terabox.com/s/1KhEKPT3OzJxHMbV5OZ2VyA",
    category: "Program",
    subcategory: "Python"
  },

  { 
    title: "Morse translator",
    downloadUrl:"https://1024terabox.com/s/1sg6uvdaF4H-TivqMyGc96A",
    category: "Program",
    subcategory: "Python"
  },
  
  { 
    title: "Grand Theft Auto 4",
    downloadUrl:"https://1024terabox.com/s/113nEu5yfDNSO3V7bnW535w",
    category: "Games",
    subcategory: "GTA"
  },  
  { 
    title: "Grand Theft Auto: San Andreas",
    downloadUrl: "https://1024terabox.com/s/1rFMGbIqxxNWUYcFTnZoWOA",
    category: "Games",
    subcategory: "GTA"
  },
  {
    title: "Grand Theft Auto: Vice City",
    downloadUrl: "https://1024terabox.com/s/1nhru16Sn5AfBAF0VGjxSUg",
    category: "Games",
    subcategory: "GTA"
  },
  {
    title: "BeamNG.drive",
    downloadUrl: "https://1024terabox.com/s/1JL5lDWTRIY85QBbkD6k7fg",
    category: "Games",
  },
  {
    title: "Getting Over It",
    downloadUrl: "https://1024terabox.com/s/19ioNoy8tywEfrbiGKv1K5w",
    category: "Games",
  },
  {
    title: "Nokia game",
    downloadUrl:"https://drive.google.com/file/d/1UDwRpGQ2hRsE1IqzOdfIRT54wUkFo_Ly/view?usp=sharing",
    category: "Games",
 
  },
  {title: "Harry potter-Book Series",
   downloadUrl:"https://drive.google.com/drive/folders/1Zla_6ilK2KdyyeDBvc_DZEemWvHPt37R?usp=sharing",
   category: "Books",
  },
  {
    title:"Harry Potter-Movie Series",
    downloadUrl:"https://1024terabox.com/s/1mLoO30vE9xsBGOtv6klNlQ",
    category: "Movies",
  },
  {
  title:"Boards Study Material",
  downloadUrl:"https://drive.google.com/drive/folders/1m0OqitYOuBMH_8t12k5X-WGuFYfmafv2?usp=sharing",
  category: "Education",
  },
  {
    title:"Haunting Adeline",
    downloadUrl:"https://1024terabox.com/s/1BbgcvDSuSlc_Mzx9n5S_UA",
    category:"Books",
    subcategory:"Cat and Mouse Duet",
  },
  {
    title:"Hunting Adeline",
    donloadUrl:"https://1024terabox.com/s/1NaeGQZx1dw4GtUHvdPhMGQ",
    category:"Books",
    subcategory:"Cat and Mouse Duet",
  },
  {
  title:"English Presentation: The Necklace",
  downloadUrl:"https://1drv.ms/p/c/2cde56a8a6170d76/IQBWRCYkx8dKR6YBk6lbbIjAAQuv776vv9XIO8iKMFKJMnw?e=2xDCYh",
  category: "Education",
  },
  {
    title:"Personal Photos",
    downloadUrl:"https://1024terabox.com/s/1xSVntnvjyuwD9SYYHSLPug",//Password:2302
    Category:"Personal",
    subcategory:"Photos",
  },
  {
    title:"NyxCipher",
    downloadUrl:"https://1024terabox.com/s/1_z8ri77yTIklslABIK4jSg",//Password:2302
    category:"Personal",
    subcategory:"Program",
  },
  {
    title:"NyxCipher",
    downloadUrl:"https://1024terabox.com/s/1_z8ri77yTIklslABIK4jSg",//Password:2302
    category:"Program",
    subcategory:"Python",
  }
]

// Helper functions for managing items
export const getItemsByCategory = (category: string) => {
  return items.filter(item => item.category === category)
}

export const getItemsBySubcategory = (category: string, subcategory: string) => {
  return items.filter(item => item.category === category && item.subcategory === subcategory)
}

export const searchItems = (searchTerm: string) => {
  return items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
}

export const getAllCategories = () => {
  return [...new Set(items.map(item => item.category))]
}

export const getAllSubcategories = (category: string) => {
  return [...new Set(items)
    .filter(item => item.category === category)
    .map(item => item.subcategory)
    .filter(Boolean)
  ]
}

// Export for easy importing
export default items
