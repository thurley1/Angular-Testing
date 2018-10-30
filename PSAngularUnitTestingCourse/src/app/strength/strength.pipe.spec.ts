import { StrengthPipe } from "./strength.pipe";

describe('StrengthPipe', () => {
    it('should display weak if strength is 5', () => {
        //arrange
        let pipe = new StrengthPipe();

        //act, assert
        expect(pipe.transform(5)).toEqual('5 (weak)');
    });

    it('should display strong if strength is 10', () => {
        //arrange
        let pipe = new StrengthPipe();

        //act, assert
        expect(pipe.transform(10)).toEqual('10 (strong)');
    });

    it('should display unbelievable if strength is 21', () => {
        //arrange
        let pipe = new StrengthPipe();

        //act, assert
        expect(pipe.transform(21)).toEqual('21 (unbelievable)');
    });
});