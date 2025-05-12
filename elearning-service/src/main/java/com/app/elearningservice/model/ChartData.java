package com.app.elearningservice.model;

import java.util.List;

public record ChartData(
        List<String> labels,
        List<Datasets> datasets
) {

}
