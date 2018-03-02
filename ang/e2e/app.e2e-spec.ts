import { TriPage } from './app.po';

describe('tri App', function() {
  let page: TriPage;

  beforeEach(() => {
    page = new TriPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
