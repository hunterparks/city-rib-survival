import { Coordinate } from './coordinate';
import shortid from 'shortid';

export enum Dimension {
    end = 'end',
    nether = 'nether',
    overworld = 'overworld'
}

export class LocationModel {
    public name: string;
    public coordinates: Coordinate;
    public dimension: Dimension;
    public id: string;
    constructor(name: string, coordinates: Coordinate, dimension: Dimension, id: string = shortid.generate()) {
        this.name = name;
        this.coordinates = coordinates;
        this.dimension = dimension;
        this.id = id;
    }
    public static getDimension(dimension: string) {
        switch(dimension) {
            case 'e':
            case 'end':
                return Dimension.end;
            case 'n':
            case 'nether':
                return Dimension.nether;
            case 'o':
            case 'overworld':
            default:
                return Dimension.overworld;
        }
    }
    public equals(otherLocaation: LocationModel): boolean {
        return (this.name === otherLocaation.name)
            && (this.coordinates.x === otherLocaation.coordinates.x)
            && (this.coordinates.y === otherLocaation.coordinates.y)
            && (this.coordinates.z === otherLocaation.coordinates.z)
            && (this.dimension === otherLocaation.dimension)
            && (this.id === this.id);
    }
}