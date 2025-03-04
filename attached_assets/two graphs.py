import pandas as pd
import plotly.express as px
import plotly.io as pio




# Load the dataset
dataset = pd.read_csv(r'C:\Users\neela\Downloads\RA2019_A2_cleaned (1).csv')


# --- GRAPH 1: Road Accident Trends Over Time ---
# Prepare data for trends
data_trends = dataset.set_index('states/uts')[
    ['total_road_accidents_2016', 'total_road_accidents_2017',
     'total_road_accidents_2018', 'total_road_accidents_2019']
]
data_trends.columns = ['2016', '2017', '2018', '2019']

# Reshape for Plotly
interactive_data = data_trends.reset_index().melt(
    id_vars='states/uts', var_name='Year', value_name='Accidents'
)

# Create interactive line graph
fig1 = px.line(
    interactive_data,
    x='Year',
    y='Accidents',
    color='states/uts',
    title="Road Accident Trends Across Indian States (2016–2019)",
    labels={'states/uts': 'States/UTs', 'Accidents': 'Total Road Accidents'},
    template="plotly"
)

# --- GRAPH 2: Top States/UTs with Most Accidents in 2019 ---
# Sort dataset by 2019 accidents
top_states_2019 = dataset[['states/uts', 'total_road_accidents_2019']].sort_values(
    by='total_road_accidents_2019', ascending=False
)

# Create bar chart
fig2 = px.bar(
    top_states_2019,
    x='states/uts',
    y='total_road_accidents_2019',
    title="Top States/UTs with Most Road Accidents in 2019",
    labels={'states/uts': 'States/UTs', 'total_road_accidents_2019': 'Road Accidents (2019)'},
    template="plotly",
    text='total_road_accidents_2019'
)
fig2.update_traces(textposition='outside')

# Show the graphs
fig1.show()
fig2.show()



# Save figures as interactive HTML
pio.write_html(fig1, "road_accident_trends.html")
pio.write_html(fig2, "top_states_accidents_2019.html")

fig.write_image("road_accident_trends.html")
fig.write_image("top_states_accidents_2019.html")

