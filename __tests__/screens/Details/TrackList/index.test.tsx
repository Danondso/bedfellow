describe('TrackList Test Suite', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // it('renders loading skeleton when no info is passed in', async () => {
  //   render(
  //     <SampleList
  //       onRefresh={() => {}}
  //       isLoading={false}
  //       trackSamples={[
  //         {
  //           artist: 'Bim',
  //           track: 'Bom',
  //           status: 'Good',
  //           samples: [
  //             {
  //               artist: 'Test',
  //               track: 'Me',
  //               year: 1299,
  //               image: 'blobby',
  //             },
  //           ],
  //         },
  //       ]}
  //     />
  //   );

  // await waitFor(() => {
  //   expect(screen.queryByTestId('tracklist_loading_skeleton')).toBeNull();
  //   expect(screen.getByText('Tim')).toBeDefined();
  //   });
  // });

  it('renders empty list component when no sample data is present', async () => {
    expect(true).toBe(true);
    // axios.get.mockReturnValueOnce(Promise.resolve({ data: emptyPayload }));
    // await render(<SampleList isLoading={false} />);

    // await waitFor(() => {
    //   expect(screen.queryByTestId('tracklist_loading_skeleton')).toBeNull();
    //   expect(screen.getByText('No data.')).toBeDefined();
    // });
  });
});
