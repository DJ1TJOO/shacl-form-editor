import { Namespace } from 'rdflib'

const XSD = Namespace('http://www.w3.org/2001/XMLSchema#')

export const string = XSD('string')
export const integer = XSD('integer')
export const decimal = XSD('decimal')
export const float = XSD('float')
export const double = XSD('double')
export const boolean = XSD('boolean')
export const date = XSD('date')
export const time = XSD('time')
export const dateTime = XSD('dateTime')

export default XSD
