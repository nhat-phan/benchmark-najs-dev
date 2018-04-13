import { make, register } from 'najs-binding'

function eloquent(this: any) {
  const components = []
  components.push(make(FillableComponent), make(AttributeComponent))
  for (const component of components) {
    component.extend(Object.getPrototypeOf(this))
  }
}

interface IModel {
  hasAttribute(attribute: string): boolean

  getFillable(): string[]
}

interface IEloquent {
  new (): IModel
}

const Eloquent: IEloquent = <any>eloquent

class FillableComponent {
  static className = 'FillableComponent'

  extend(prototype: Object) {
    prototype['getFillable'] = FillableComponent.getFillable
  }

  static getFillable(this: IModel) {
    console.log(this.hasAttribute('test'))
    return ['fillable']
  }
}
register(FillableComponent, FillableComponent.className, true, true)

class AttributeComponent {
  static className = 'AttributeComponent'

  extend(prototype: Object) {
    prototype['hasAttribute'] = AttributeComponent.hasAttribute
  }

  static hasAttribute(attribute: string) {
    return attribute === 'test'
  }
}
register(AttributeComponent, AttributeComponent.className, true, true)

class Post extends Eloquent {}

const post = new Post()
console.log(post.getFillable())
console.log(Post.prototype)
