import test from 'ava';
import { parseRAMLSync } from 'raml-1-parser';
import { getDefinitionSchama } from '../src/read_raml';

test('when read raml given Product type then get definitionSchema object', t => {
  const definitionSchema = {
    $id: '/definitionSchema',
    definitions: {
      Product: {
        type: 'object',
        properties: {
          productId: {
            type: ['string']
          },
          name: {
            type: ['number']
          }
        },
        required: ['productId', 'name']
      }
    }
  };
  const ramlStr = `
#%RAML 1.0
---
types:
  Product:
    type: object
    properties:
      productId:
        type: string
      name: number
    `;
  const apiJSON = parseRAMLSync(ramlStr, {
    serializeMetadata: false
  });
  t.deepEqual(getDefinitionSchama(apiJSON), definitionSchema);
});

test('when read raml given Product.productId no required type then get definitionSchema object', t => {
  const definitionSchema = {
    $id: '/definitionSchema',
    definitions: {
      Product: {
        type: 'object',
        properties: {
          productId: {
            type: ['string']
          },
          name: {
            type: ['number']
          }
        },
        required: ['name']
      }
    }
  };
  const ramlStr = `
#%RAML 1.0
---
types:
  Product:
    type: object
    properties:
      productId:
        type: string
        required: false
      name: number
  `;
  const apiJSON = parseRAMLSync(ramlStr, {
    serializeMetadata: false
  });
  t.deepEqual(getDefinitionSchama(apiJSON), definitionSchema);
});

test('when read raml given Product.productId has minLength then get definitionSchema object', t => {
  const definitionSchema = {
    $id: '/definitionSchema',
    definitions: {
      Product: {
        type: 'object',
        properties: {
          productId: {
            type: ['string'],
            minLength: 1,
            maxLength: 22
          },
          name: {
            type: ['number']
          }
        },
        required: ['name']
      }
    }
  };
  const ramlStr = `
#%RAML 1.0
---
types:
  Product:
    type: object
    properties:
      productId:
        type: string
        required: false
        minLength: 1
        maxLength: 22
      name: number
  `;
  const apiJSON = parseRAMLSync(ramlStr, {
    serializeMetadata: false
  });
  t.deepEqual(getDefinitionSchama(apiJSON), definitionSchema);
});

test('when read raml given Product and Paragraph then get definitionSchema object', t => {
  const definitionSchema = {
    $id: '/definitionSchema',
    definitions: {
      Product: {
        type: 'object',
        properties: {
          productId: {
            type: ['string'],
            minLength: 1,
            maxLength: 22
          },
          name: {
            type: ['number']
          }
        },
        required: ['name']
      },
      Paragraph: {
        type: 'object',
        properties: {
          title: {
            type: ['string']
          },
          text: {
            type: ['string']
          }
        },
        required: ['title', 'text']
      }
    }
  };
  const ramlStr = `
#%RAML 1.0
---
types:
  Product:
    type: object
    properties:
      productId:
        type: string
        required: false
        minLength: 1
        maxLength: 22
      name: number

  Paragraph:
    type: object
    properties:
      title:
      text:
  `;
  const apiJSON = parseRAMLSync(ramlStr, {
    serializeMetadata: false
  });
  t.deepEqual(getDefinitionSchama(apiJSON), definitionSchema);
});

test('when read raml given Product of Paragraph then get definitionSchema object', t => {
  const definitionSchema = {
    $id: '/definitionSchema',
    definitions: {
      Product: {
        type: 'object',
        properties: {
          productId: {
            type: ['string'],
            minLength: 1,
            maxLength: 22
          },
          name: {
            type: ['number']
          }
        },
        required: ['name']
      },
      Paragraph: {
        type: 'object',
        properties: {
          title: {
            type: ['string']
          },
          text: {
            type: ['string']
          },
          product: {
            $ref: '/definitionSchema#/definitions/Product'
          }
        },
        required: ['title', 'text']
      }
    }
  };
  const ramlStr = `
#%RAML 1.0
---
types:
  Product:
    type: object
    properties:
      productId:
        type: string
        required: false
        minLength: 1
        maxLength: 22
      name: number

  Paragraph:
    type: object
    properties:
      title:
      text:
      product:
        type: Product
        required: false
  `;
  const apiJSON = parseRAMLSync(ramlStr, {
    serializeMetadata: false
  });
  t.deepEqual(getDefinitionSchama(apiJSON), definitionSchema);
});

test('when read raml given Type Array then get definitionSchema object', t => {
  const definitionSchema = {
    $id: '/definitionSchema',
    definitions: {
      Article: {
        type: 'object',
        properties: {
          articleId: {
            type: ['string']
          },
          author: {
            type: ['string']
          },
          paragraphs: {
            items: [
              {
                $ref: '/definitionSchema#/definitions/Paragraph'
              }
            ],
            additionalItems: {
              $ref: '/definitionSchema#/definitions/Paragraph'
            }
          }
        },
        required: ['author', 'paragraphs']
      },
      Product: {
        type: 'object',
        properties: {
          productId: {
            type: ['string'],
            minLength: 1,
            maxLength: 22
          },
          name: {
            type: ['number']
          }
        },
        required: ['name']
      },
      Paragraph: {
        type: 'object',
        properties: {
          title: {
            type: ['string']
          },
          text: {
            type: ['string']
          },
          product: {
            $ref: '/definitionSchema#/definitions/Product'
          }
        },
        required: ['title', 'text']
      }
    }
  };
  const ramlStr = `
#%RAML 1.0
---
types:
  Article:
    type: object
    properties:
      articleId:
        type: string
        required: false
      author: string
      paragraphs: Paragraph[]
  Product:
    type: object
    properties:
      productId:
        type: string
        required: false
        minLength: 1
        maxLength: 22
      name: number

  Paragraph:
    type: object
    properties:
      title:
      text:
      product:
        type: Product
        required: false
  `;
  const apiJSON = parseRAMLSync(ramlStr, {
    serializeMetadata: false
  });
  t.deepEqual(getDefinitionSchama(apiJSON), definitionSchema);
});
