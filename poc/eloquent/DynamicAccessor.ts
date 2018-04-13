function createDynamicPropertyDescriptor(name: string): PropertyDescriptor {
  return {
    get(this: any) {
      if (typeof this.dynamic[name] === 'undefined') {
        return this.getAttribute(name)
      }
      return this[this.dynamic[name].accessor].call(this)
    },
    set(value: any) {}
  }
}

class Model {
  protected dynamic: Object
  protected attributes: Object
  protected fillable?: string[]

  constructor() {
    this.attributes = {}
    this.dynamic = {}
    const prototype = Object.getPrototypeOf(this)
    this.findAccessorsAndMutators(prototype)
    this.bindAccessors(prototype)
  }

  bindAccessors(prototype: any) {
    if (typeof prototype['__controls'] === 'undefined') {
      prototype.__controls = {}
    }
    if (prototype.__controls.boundDynamicProperties) {
      return
    }

    prototype.__controls.boundDynamicProperties = true
    console.log('bind property')
    for (const name in this.dynamic) {
      Object.defineProperty(prototype, name, createDynamicPropertyDescriptor(name))
    }
  }

  findAccessorsAndMutators(prototype: any) {
    const names = Object.getOwnPropertyNames(prototype)
    const regex = new RegExp('^(get|set)([a-zA-z0-9_\\-]{1,})Attribute$', 'g')

    names.forEach(name => {
      let match
      while ((match = regex.exec(name)) != undefined) {
        const property: string = match[2].toLowerCase()
        if (typeof this.dynamic[property]) {
          this.dynamic[property] = {}
        }
        if (match[1] === 'get') {
          this.dynamic[property].accessor = match[0]
        } else {
          this.dynamic[property].mutator = match[0]
        }
      }
    })
  }
}

class User extends Model {
  name: string

  getNameAttribute() {
    return this.attributes['name']
  }
}

const user = new User()
const userTwo = new User()
user['attributes'] = { name: 'test' }
console.log(user['__controls'])
console.log(userTwo['__controls'])
console.log(user.name)

// interface IModel {
//   // Fillable: 8 functions
//   getFillable(): void
//   getGuarded(): void
//   fill(): void
//   forceFill(): void
//   isFillable(): void
//   isGuarded(): void
//   markFillable(): void
//   markGuarded(): void

//   // Attribute: 6 functions
//   getAttribute(): void
//   setAttribute(): void
//   hasAttribute(): void
//   getPrimaryKey(): void
//   setPrimaryKey(): void
//   getPrimaryKeyName(): void

//   // Serialize: 9 functions
//   getVisible(): void
//   getHidden(): void
//   isVisible(): void
//   isHidden(): void
//   toObject(): void
//   toJSON(): void
//   toJson(): void
//   markVisible(): void
//   markHidden(): void

//   // ActiveRecord: 4 functions
//   save(): void
//   delete(): void
//   forceDelete(): void
//   fresh(): void

//   // Timestamps: 1 function
//   touch(): void

//   // SoftDeletes: 1 function
//   restore(): void

//   // Model: 2 function
//   is(): void
//   isDirty(): void
// }
