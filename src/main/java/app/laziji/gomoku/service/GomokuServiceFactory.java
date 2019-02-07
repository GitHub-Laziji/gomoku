package app.laziji.gomoku.service;

import app.laziji.gomoku.service.impl.NeuralNetworkGomokuServiceImpl;
import app.laziji.gomoku.service.impl.SituationalAssessmentGomokuServiceImpl;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class GomokuServiceFactory {

    private static final Map<String, GomokuService> serviceMapping = new ConcurrentHashMap<>();

    static {
        serviceMapping.put("situationalAssessment", new SituationalAssessmentGomokuServiceImpl());
        serviceMapping.put("neuralNetwork", new NeuralNetworkGomokuServiceImpl());
    }

    public static GomokuService getInstance(String serviceName) {
        if (serviceName == null) {
            return null;
        }
        return serviceMapping.get(serviceName);
    }
}
